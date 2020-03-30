import { motion, Variants } from "framer-motion";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

const transition = { ease: "easeInOut", duration: 0.3 };

interface Props {
  title?: string;
}

/**
 * Base Page component that animates when it enters/exits from route change
 */
const Page: React.FC<Props> = ({ children, title, ...props }) => {
  const history = useHistory();

  useEffect(() => {
    document.title = title || "Golfstats";
  }, [title]);

  const variants: Variants = {
    enter() {
      // if isPush is true, this is the eventual destination of the top page (sliding in from the right)
      // if isPush is false, this is the eventual destination of the bottom page (sliding in from the left)
      const isPush = history.action === "PUSH";

      return {
        y: 0,
        transition,
        transitionEnd: {
          // after animation has finished, reset the position to static
          position: "static"
        },
        // keep top "layer" of animation as a fixed position
        ...(isPush
          ? {
              position: "fixed",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0
            }
          : {})
      };
    },
    initial() {
      // if isPush is true, this is the starting position of top page (sliding in from the right)
      // if ifPush is false, this is the starting position of bottom page (sliding in from the left)
      const isPush = history.action === "PUSH";

      return {
        y: isPush ? "10%" : "25%",
        boxShadow: isPush ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0",
        transition,
        // keep top "layer" of animation as a fixed position
        ...(isPush
          ? {
              position: "fixed",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0
            }
          : {})
      };
    },

    // an updated history.action is provided in AnimatedSwitch via "custom" prop for AnimatePresence
    exit({ action }) {
      // if isPop is true, this is the top page being dismissed (sliding to the right)
      // if isPop is false, this is the botom page being dismissed (sliding to the left)
      const isPop = action === "POP";

      return {
        y: isPop ? "100%" : "-10%",
        zIndex: isPop ? 1 : -1,
        boxShadow: isPop ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0",
        transition,

        // keep top "layer" of animation as a fixed position
        // this will, however, reset the scroll position of the page being dismissed
        ...(isPop
          ? {
              position: "fixed",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0
            }
          : {})
      };
    }
  };

  return (
    <motion.main
      initial="initial"
      animate="enter"
      exit="exit"
      variants={variants}
      className={title ? "has-header" : "no-header"}
      {...props}
    >
      {children}
    </motion.main>
  );
};

export default Page;
