import React from "react";

import Container from "@material-ui/core/Container";
import NavTabs from "./nav-tabs";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";

const Layout = ({ children }) => {
  return (
    <Container maxWidth="lg">
      <Paper style={{ minHeight: "100vh" }} elevation={0}>
        <NavTabs />
        <Box pt={4}>{children}</Box>
      </Paper>
    </Container>
  );
};

export default Layout;
