import vitePluginRequireTransform from "../src";
import { readFileSync,writeFileSync } from "fs";
import glob from "glob"


glob("__test__/case*/*.ts",{
    ignore:"**/*transformed_result.ts"
},  async (err, files) =>{
    for(const file of files){
        const fileContent = readFileSync(file,'utf-8');
        const transformedContent = await vitePluginRequireTransform().transform(fileContent,file);
        writeFileSync(file.replace('.ts','_transformed_result.ts'),transformedContent.code);
    }
})  