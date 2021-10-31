import { start as _vite_plugin_require_transform_case2start, stop as _vite_plugin_require_transform_case2stop } from "case2";
const _vite_plugin_require_transform_case2 = {
  start: _vite_plugin_require_transform_case2start,
  stop: _vite_plugin_require_transform_case2stop
};
const case2A = location.host == 'test' ? null : _vite_plugin_require_transform_case2;

if (location.host == 'test1') {
  case2A.start();
}

case2A.stop();