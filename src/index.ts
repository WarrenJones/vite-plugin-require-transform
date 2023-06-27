import * as parser from "@babel/parser";
import traverse, { NodePath } from "@babel/traverse";
import generate, { GeneratorResult } from "@babel/generator";
import * as t from '@babel/types';


type VitePluginRequireTransformParamsType = {
	// Filter files that should enter the plugin
	fileRegex?: RegExp,
	// Prefix for created import variable names
	importPrefix?: string,
	// Function to convert the require path to the import variable name
	importPathHandler?: Function
}

export default function vitePluginRequireTransform(
	params: VitePluginRequireTransformParamsType = {}
) {

	const {
		fileRegex = /.ts$|.tsx$/,
		importPrefix: prefix = '_vite_plugin_require_transform_',
		importPathHandler = (path: string) => path.replace(/(.*\/)*([^.]+).*/ig, "$2").replace(/-/g, '_')
	} = params;

	return {
		name: prefix,
		async transform(code: string, id: string) {
			if (!fileRegex.test(id)) {
				return { code: code, map: null };
			}

			const importMap = new Map<string, NodePath<t.Node>[]>;

			const plugins: parser.ParserPlugin[] = [];

			const ast = parser.parse(code, {
				sourceType: "module",
				plugins,
				sourceFilename: id
			});

			const declaredVariables: { [key: string]: t.VariableDeclarator } = {};

			// Collect `require(...)`
			traverse(ast, {
				enter(path) {

					const reportError = (message: string) => {
						const loc = path.parentPath?.node.loc?.start;
						console.error(message + ' in ' + id + (loc ? ":" + loc.line + ':' + loc.column : ""));
					}

					if (path.parentPath?.node && t.isVariableDeclarator(path.parentPath.node)) {
						const name = ((path.parentPath.node as t.VariableDeclarator).id as t.Identifier).name;
						if (!declaredVariables[name]) {
							declaredVariables[name] = path.parentPath.node;
						}
					}

					if (path.isIdentifier({ name: 'require' }) && t.isCallExpression(path?.parentPath?.node)) {
						const argument = path.parentPath.node.arguments[0];

						let requirePath: string | undefined = undefined;
						if (t.isTemplateLiteral(argument)) {
							const tl = argument as t.TemplateLiteral;

							let templateElementValue = '';
							for (let i = 0; i < tl.quasis.length; i++) {
								const element = tl.quasis[i];
								const expression = tl.expressions[i]
								
								if (expression === undefined) {
									continue;
								}

								if (t.isIdentifier(expression)) {
									const identifier = expression as t.Identifier;

									const variableValue = declaredVariables[identifier.name]?.init

									if ((variableValue === undefined) || (variableValue === null)) {
										reportError(`Unknown variable for template value: "${identifier.name}"`);
										continue;
									}

									if (t.isStringLiteral(variableValue)) {
										const sl = variableValue as t.StringLiteral;

										templateElementValue += element.value.raw;
										templateElementValue += variableValue.value;
									} else {
										reportError(`Unknown type of template value: "${variableValue.type}" for "${identifier.name}"`);
									}
							
								} else {
									reportError(`Unknown type of template expression: "${expression.type}"`);
								}
							}
							requirePath = templateElementValue;
						} else if (t.isStringLiteral(argument)) {
							const sl = argument as t.StringLiteral;

							requirePath = sl.value;
						} else {
							reportError(`Unknown type of require argument: "${argument.type}"`);
							return;
						}

						const nodes = importMap.get(requirePath) ?? []
						nodes.push(path.parentPath);
						importMap.set(requirePath, nodes);
					}
				}
			});

			// Transform the code
			let importIndex = 0;
			for (const [requirePath, nodes] of importMap) {

				const importVariableName = prefix + importPathHandler(requirePath) + '_' + importIndex++;
				const identifier = t.identifier(importVariableName);

				// Create import statement
				const importNamespaceSpecifier = t.importNamespaceSpecifier(identifier);
				const importDeclaration = t.importDeclaration([importNamespaceSpecifier], t.stringLiteral(requirePath));
				importDeclaration.loc = nodes[0].node.loc
				ast.program.body.unshift(importDeclaration);

				// Replace `require(...)` by import variable
				const identifierDefault = t.memberExpression(identifier, t.identifier("default"));
				const identifierDefaultOrIdentifier = t.logicalExpression('||', identifierDefault, identifier);
				nodes.forEach(node => {
					node.replaceWith(identifierDefaultOrIdentifier);
				});
			}

			const output = generate(ast, { sourceMaps: true });
			return { code: output.code, map: output.map };
		},
	};
}
