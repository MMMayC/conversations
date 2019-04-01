import React from "react";
import { mount, shallow} from 'enzyme';
import { App } from "../client/components/app.js";

describe('App', function(){
  it('should render without crashing', () => {
    const App = mount(<App />);
    expect(App.find("div")).toHaveLength(1);
  });

});