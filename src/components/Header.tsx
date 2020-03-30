import { Button, Grid, Typography } from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBackIos";
import { AnimatePresence, motion } from "framer-motion";
import React, { useLayoutEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const history = useHistory();
  const [titleKey, setTitleKey] = useState("");

  // our header title re-renders when location.pathname changes, however this is
  // slightly before document.title updates in <Page />, so we need to wait just a
  // tad longer before we re-render our title
  useLayoutEffect(() => {
    setTitleKey(location.pathname);
  }, [location.pathname]);

  const variants = {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="header">
      <Grid container justify="space-between">
        <Grid item xs={4}>
          <AnimatePresence>
            {location.pathname !== "/" && (
              <motion.div
                initial="initial"
                animate="enter"
                exit="exit"
                variants={variants}
              >
                <Button
                  startIcon={<ArrowBack />}
                  component={Link}
                  to="/"
                  onClick={(e: any) => {
                    // ideally you would do some location tracking somewhere to know if you can go back or not
                    // and then conditionally run this if so. otherwise, the back button does not work if they cannot go back
                    e.preventDefault();
                    history.goBack();
                    return false;
                  }}
                >
                  Back
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
        <Grid item xs={4} style={{ position: "relative" }}>
          <AnimatePresence>
            <motion.div
              // when titleKey changes our title will re-render and trigger fade in/out
              key={titleKey}
              initial="initial"
              animate="enter"
              exit="exit"
              variants={variants}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 2,
                bottom: 0
              }}
            >
              <Typography variant="h6" align="center">
                {document.title}
              </Typography>
            </motion.div>
          </AnimatePresence>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    </div>
  );
}
