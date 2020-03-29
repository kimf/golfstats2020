// declare module "react-router-transition";
import React from "react";
import { Provider } from "react-redux";

// import { BrowserRouter as Router, Route } from "react-router-dom";
// import { AnimatedSwitch } from "react-router-transition";
import Courses from "./screens/Courses";
import Play from "./screens/Play";
import store from "./store";

function App() {
  return (
    <div className="container">
      <Provider store={store}>
        <Courses />
        {/*   <Router>
          <AnimatedSwitch
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 0 }}
            atActive={{ opacity: 1 }}
            className="switch-wrapper"
          >
            <Route exact path="/" component={Courses} />
            <Route path="/play" component={Play} />
          </AnimatedSwitch>
        </Router> */}
      </Provider>
    </div>
  );
}

export default App;
