import _vite_plugin_require_transform_caseA_extB_bbb from "caseA_extB_bbb";
import _vite_plugin_require_transform_caseA_extA_aaa from "caseA_extA_aaa";
//same path,different extension
const testCaseA = _vite_plugin_require_transform_caseA_extA_aaa;
const testCaseB = _vite_plugin_require_transform_caseA_extB_bbb;
console.log("caseA", testCaseA);
console.log("caseB", testCaseB);