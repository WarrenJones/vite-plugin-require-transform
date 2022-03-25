
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from '@babel/types';


export type VitePluginRequireTransformParamsType = {
	//filter files that should enter the plugin
	fileRegex?: RegExp,
	//prefix that would plugin into the requireSpecifier 
	importPrefix?: string,
	//to deal with the requireSpecifier
	importPathHandler?: Function
}
export default function vitePluginRequireTransform(
	params: VitePluginRequireTransformParamsType = {}
) {

	const { fileRegex = /.ts$|.tsx$/, importPrefix: prefix = '_vite_plugin_require_transform_', importPathHandler } = params;
	/**
	 * <path,exports>
	 */
	let importMap = new Map<string, Set<string>>();
	/**
	 * {variable,path}
	 */
	let variableMather: { [key: string]: string } = {};
	/**
	* {variable,path}
	*/
	let requirePathMatcher: { [key: string]: string } = {};
	return {
		name: prefix,
		async transform(code: string, id: string) {
			let newCode = code;
			if (fileRegex.test(id)) {
				let plugins: parser.ParserPlugin[] = [];

				const ast = parser.parse(code, {
					sourceType: "module",
					plugins,
				});
				traverse(ast, {
					enter(path) {
						//require('./xxx')
						if (path.isIdentifier({ name: 'require' }) && t.isCallExpression(path?.parentPath?.node)) {
							let originalRequirePath = (path.parentPath.node.arguments[0] as t.StringLiteral).value;
							let requirePath = originalRequirePath;
							//get the file name
							if (importPathHandler) {
								requirePath = importPathHandler(requirePath);
							} else {
								requirePath = requirePath.replace(/(.*\/)*([^.]+).*/ig, "$2").replace(/-/g, '_');
							}
							requirePathMatcher[requirePath] = originalRequirePath;
							if (!importMap.has(requirePath)) {
								importMap.set(requirePath, new Set());
							}
							//require('xxx').AAA
							if (t.isMemberExpression(path.parentPath.parentPath) && t.isIdentifier((path?.parentPath?.parentPath?.node as t.MemberExpression)?.property)) {
								const requirePathExports = importMap.get(requirePath);
								const property = (path?.parentPath?.parentPath?.node as t.MemberExpression)?.property as t.Identifier;
								const currentExport = property?.name;
								if (requirePathExports) {
									requirePathExports.add(currentExport);
									importMap.set(requirePath, requirePathExports);
									//replace current line code
									path.parentPath.parentPath.replaceWithSourceString(prefix + requirePath + "_" + currentExport)
								}
							} else {
								//replace current line code
								path.parentPath.replaceWithSourceString(prefix + requirePath)
								/**
								 * if such case like 
								 * const result = condition ? null : require('zzz/yyy/xxx');
								 * need to record the result variable，and find what it invoke afterwards,eg.
								 * result.start();
								 * result.stop();
								 * 
								 * finally it will be turned into
								 * import {start as _vite_plugin_require_transform_xxxstart,stop as _vite_plugin_require_transform_xxxstop} from "zzz/yyy/xxx"
								 * const _vite_plugin_require_transform_xxx = {start:_vite_plugin_require_transform_start,stop:_vite_plugin_require_transform_stop}
								 * const result = _vite_plugin_require_transform_xxx;
								 */

								// case1:const result = require('zzz/yyy/xxx');
								if (t.isVariableDeclarator(path.parentPath?.parentPath?.node)) {
									const variableDeclarator: t.VariableDeclarator = path.parentPath?.parentPath?.node;
									variableMather[(variableDeclarator.id as t.Identifier).name] = requirePath;
								}
								//case2: const result = condition ? null : require('zzz/yyy/xxx');
								if (t.isConditionalExpression(path.parentPath?.parentPath?.node) && t.isVariableDeclarator(path?.parentPath?.parentPath?.parentPath?.node)) {
									const variableDeclarator: t.VariableDeclarator = path.parentPath?.parentPath?.parentPath?.node;
									variableMather[(variableDeclarator.id as t.Identifier).name] = requirePath;
								}
							}
						}

						//check if raw method such as XXX.forEach()
						const isRawMethodCheck = (currentExport: string) => {
							return Object.prototype.toString.call(new Array()[currentExport]).includes("Function") || Object.prototype.toString.call(new Object()[currentExport]).includes("Function")
						}
						//exist function invoke
						//eg：XXX.start();
						if (t.isIdentifier(path.node) && variableMather[path.node?.name]) {
							const requirePath = variableMather[path.node.name];
							const requirePathExports = importMap.get(requirePath);
							const currentExport = ((path.parentPath.node as t.MemberExpression)?.property as t.Identifier)?.name;
							if (currentExport && !isRawMethodCheck(currentExport) && requirePathExports)
								requirePathExports.add(currentExport);
						}
					}
				});
				//insert import
				for (const importItem of importMap.entries()) {
					let originalPath = requirePathMatcher[importItem[0]];
					let requireSpecifier = importItem[0];
					//get the file name
					if (importPathHandler) {
						requireSpecifier = importPathHandler(requireSpecifier);
					} else {
						requireSpecifier = requireSpecifier.replace(/(.*\/)*([^.]+).*/ig, "$2").replace(/-/g, '_');
					}
					//non default
					if (importItem[1].size) {
						const importSpecifiers = []
						for (const item of importItem[1].values()) {
							item && importSpecifiers.push(t.importSpecifier(t.identifier(prefix + requireSpecifier + "_" + item), t.identifier(item)))
						}
						const importDeclaration = t.importDeclaration(importSpecifiers, t.stringLiteral(originalPath));
						ast.program.body.unshift(importDeclaration);
					} else {
						const importDefaultSpecifier = [t.importDefaultSpecifier(t.identifier(prefix + requireSpecifier))];
						const importDeclaration = t.importDeclaration(importDefaultSpecifier, t.stringLiteral(originalPath));
						ast.program.body.unshift(importDeclaration);
					}
				}
				const statementList: t.Statement[] = [];
				/**
				 * insert the assignment 
				 * eg： 
				 * const _vite_plugin_require_transform_XXX = {start:_vite_plugin_require_transform__XXX_start,stop:_vite_plugin_require_transform__XXX_stop}
				 * */
				for (const requirePath of Object.values(variableMather)) {
					const importExports = importMap.get(requirePath);
					if (importExports?.size) {
						const idIdentifier = t.identifier(prefix + requirePath)
						const properties = []
						for (const currentExport of importExports?.values()) {
							properties.push(t.objectProperty(t.identifier(currentExport), t.identifier(prefix + requirePath + "_" + currentExport)));
						}
						const initObjectExpression = t.objectExpression(properties);
						statementList.push(t.variableDeclaration('const', [t.variableDeclarator(idIdentifier, initObjectExpression)]));
					}
				}
				//insert the statementList right the end of  ImportDeclaration 
				const index = ast.program.body.findIndex((value) => {
					return !t.isImportDeclaration(value);
				})
				ast.program.body.splice(index, 0, ...statementList);
				const output = generate(ast);
				newCode = output.code;


			}
			importMap = new Map<string, Set<string>>();
			variableMather = {};
			return { code: newCode };
		},
	};
}
