import React, { useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const NavTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <AppBar position="relative" elevation={0}>
        <Tabs
          TabIndicatorProps={{ style: { background: "#fff" } }}
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="navigation tabs"
        >
          <Tab label="Create user" component={Link} to="/" />
          <Tab label="List users" component={Link} to="/users" />
        </Tabs>
      </AppBar>
    </div>
  );
};

export default NavTabs;
