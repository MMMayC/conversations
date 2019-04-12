import React, { Component } from "react";
import { connect } from "react-redux";

export class App extends Component {
  render() {
    return <div>Hello, SSR!</div>;
  }
}
function mapStateToProps(state) {
  const {} = state;
  return {};
}
export default connect(mapStateToProps)(App);
