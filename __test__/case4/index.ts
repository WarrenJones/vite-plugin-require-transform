const tlA = 'TemplateLiteralCaseA';
const tlB = 'TemplateLiteralCaseB';
//TemplateLiteral
const testCaseA = require(`${tlA}/caseA/${tlA}`);
const testCaseB = require(`caseB/CaseBB/${tlB}`);

console.log('caseA', testCaseA);
console.log('caseB', testCaseB);
