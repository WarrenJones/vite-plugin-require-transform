const case1a = require("case1a");
console.log("case1a", case1a)

case1a.foobar()

const case1b = {
    ...require("case1b")
};

const obj = {
    require: (name) => {}
};
const case1c = obj.require("case1c");