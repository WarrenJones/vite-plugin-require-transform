
//same path,different extension
const testCaseA = require("caseA.extA?aaa");
const testCaseB = require("caseA.extB?bbb");

console.log("caseA", testCaseA)
console.log("caseB", testCaseB)