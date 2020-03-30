import { AnimatePresence } from "framer-motion";
import React from "react";
import { Switch, useHistory, useLocation } from "react-router";

/**
 * A react-route Switch enhanced with AnimatePresence to trigger animations between routes
 */
const AnimatedSwitch: React.FC = ({ children }) => {
  const location = useLocation();
  const history = useHistory();

  return (
    <AnimatePresence
      exitBeforeEnter={false}
      initial={false}
      // the exit animation needs the updated history to know if it's a push or pop
      custom={{ action: history.action }}
    >
      <Switch location={location} key={location.pathname}>
        {children}
      </Switch>
    </AnimatePresence>
  );
};

export default AnimatedSwitch;
