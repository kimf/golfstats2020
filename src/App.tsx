import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";

import AnimatedSwitch from "./components/AnimatedSwitch";
// import Header from "./components/Header";
import Courses from "./screens/Courses";
import Play from "./screens/Play";
import store from "./store";

function App() {
  return (
    <div className="container">
      <Provider store={store}>
        <Router>
          <AnimatedSwitch>
            <Route path="/play/:id">
              <Play />
            </Route>
            <Route path="/">
              <Courses />
            </Route>
          </AnimatedSwitch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
