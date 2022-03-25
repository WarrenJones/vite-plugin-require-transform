import { start as _vite_plugin_require_transform_case2_start, stop as _vite_plugin_require_transform_case2_stop } from "case2";
const _vite_plugin_require_transform_case2 = {
  start: _vite_plugin_require_transform_case2_start,
  stop: _vite_plugin_require_transform_case2_stop
};
const case2A = location.host == 'test' ? null : _vite_plugin_require_transform_case2;

if (location.host == 'test1') {
  case2A.start();
}

case2A.stop();