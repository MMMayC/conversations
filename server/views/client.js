"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _reactRedux = require("react-redux");

var _configureStore = _interopRequireDefault(require("./redux/configureStore"));

var _app = _interopRequireDefault(require("./components/app"));

var _index = _interopRequireDefault(require("./styles/index.scss"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var state = window.__STATE__;
delete window.__STATE__;
var store = (0, _configureStore.default)(state);
(0, _reactDom.hydrate)(_react.default.createElement(_reactRedux.Provider, {
  store: store
}, _react.default.createElement(_app.default, null)), document.querySelector('#app'));