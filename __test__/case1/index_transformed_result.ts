import * as _vite_plugin_require_transform_case1b_1 from "case1b";
import * as _vite_plugin_require_transform_case1a_0 from "case1a";
const case1a = _vite_plugin_require_transform_case1a_0.default || _vite_plugin_require_transform_case1a_0;
console.log("case1a", case1a);
case1a.foobar();
const case1b = {
  ...(_vite_plugin_require_transform_case1b_1.default || _vite_plugin_require_transform_case1b_1)
};
const obj = {
  require: name => {}
};
const case1c = obj.require("case1c");