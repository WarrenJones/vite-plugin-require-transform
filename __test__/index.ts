import vitePluginRequireTransform from "../src";
import { readFileSync, writeFileSync } from "fs";
import glob from "glob"


glob("__test__/case1/*.ts", {
    ignore: "**/*transformed_result.ts"
}, async (err, files) => {
    for (const file of files) {
        const fileContent = readFileSync(file, 'utf-8');
        const transformedContent = await vitePluginRequireTransform().transform(fileContent, file);
        writeFileSync(file.replace('.ts', '_transformed_result.ts'), transformedContent.code);
    }
})

glob("__test__/case2/*.ts", {
    ignore: "**/*transformed_result.ts"
}, async (err, files) => {
    for (const file of files) {
        const fileContent = readFileSync(file, 'utf-8');
        const transformedContent = await vitePluginRequireTransform().transform(fileContent, file);
        writeFileSync(file.replace('.ts', '_transformed_result.ts'), transformedContent.code);
    }
})

glob("__test__/case3/*.ts", {
    ignore: "**/*transformed_result.ts"
}, async (err, files) => {
    for (const file of files) {
        const fileContent = readFileSync(file, 'utf-8');
        const transformedContent = await vitePluginRequireTransform(
            {
                importPathHandler: (requirePath: string) => {
                    return requirePath.replace('.', '_').replace('?', "_");
                }
            }
        ).transform(fileContent, file);
        writeFileSync(file.replace('.ts', '_transformed_result.ts'), transformedContent.code);
    }
})  