"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRandomDialogs = getRandomDialogs;
exports.getNextDialogs = getNextDialogs;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getRandomDialogs() {
  return function (dispatch) {
    _axios.default.get("/candidates").then(function (res) {
      dispatch({
        type: GET_CANDIDATES,
        candidates: res.data
      });
    }).catch(function (err) {
      console.log("Get candidates action: ", err);
    });
  };
}

function getNextDialogs() {}