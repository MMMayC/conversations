"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = apps;

function apps() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    isFetching: false,
    apps: []
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    default:
      return state;
  }
}