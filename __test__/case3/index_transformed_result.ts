import _vite_plugin_require_transform_caseA_extB_bbb from "caseA.extB?bbb";
import _vite_plugin_require_transform_caseA_extA_aaa from "caseA.extA?aaa";
//same path,different extension
const testCaseA = _vite_plugin_require_transform_caseA_extA_aaa;
const testCaseB = _vite_plugin_require_transform_caseA_extB_bbb;
console.log("caseA", testCaseA);
console.log("caseB", testCaseB);