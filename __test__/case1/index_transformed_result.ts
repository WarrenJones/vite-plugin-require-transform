import before_case1a from "before-case1a";
import * as _vite_plugin_require_transform_case1a_0 from "case1a";
const case1a = _vite_plugin_require_transform_case1a_0.default || _vite_plugin_require_transform_case1a_0;
import after_case1a from "after-case1a";
console.log("case1a", case1a);
case1a.foobar();
import * as _vite_plugin_require_transform_case1b_1 from "case1b";
const case1b = {
  ...(_vite_plugin_require_transform_case1b_1.default || _vite_plugin_require_transform_case1b_1)
};
const obj = {
  require: name => {}
};
const case1c = obj.require("case1c");
import * as _vite_plugin_require_transform_case1d_2 from "case1d";
if (true) {
  _vite_plugin_require_transform_case1d_2.default || _vite_plugin_require_transform_case1d_2;
}
import * as _vite_plugin_require_transform_case1e_0_3 from "case1e_0";
import * as _vite_plugin_require_transform_case1e_1_4 from "case1e_1";
import * as _vite_plugin_require_transform_case1e_2_5 from "case1e_2";
function case1e() {
  let e0 = _vite_plugin_require_transform_case1e_0_3.default || _vite_plugin_require_transform_case1e_0_3;
  if (true) {
    let e1 = _vite_plugin_require_transform_case1e_1_4.default || _vite_plugin_require_transform_case1e_1_4;
  }
  let e2 = _vite_plugin_require_transform_case1e_2_5.default || _vite_plugin_require_transform_case1e_2_5;
}