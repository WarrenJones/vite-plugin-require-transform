import before_case1a from "before-case1a";
const case1a = require("case1a");
import after_case1a from "after-case1a";
console.log("case1a", case1a)

case1a.foobar()

const case1b = {
    ...require("case1b")
};

const obj = {
    require: (name) => {}
};
const case1c = obj.require("case1c");

if(true) {
    require("case1d")
}

function case1e() {
    let e0 = require("case1e_0");
    if (true) {
        let e1 = require("case1e_1");
    }
    let e2 = require("case1e_2");
}