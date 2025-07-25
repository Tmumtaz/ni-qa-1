import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../config.json";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginBottom: theme.spacing(2),
    },
  },
}));

function UserForm({ user }) {
  const classes = useStyles();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [active, setActive] = useState(false);
  let history = useHistory();

  const values = {
    fullName: fullName,  // Fixed: was using 'fname' but API expects 'fullName'
    email,
    phone
  };

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ? user.fullName : "");  // Fixed: was checking 'fname'
      setEmail(user.email ? user.email : "");
      setPhone(user.phone ? user.phone : "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: newUser } = await axios.post(
        config.ApiURL + "/save",
        user && user._id ? { ...values, id: user._id } : values  // Include ID for updates
      );
      user = newUser;
      setActive(true);
    } catch (err) {
      alert("Ups, something went wrong!");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(config.ApiURL + `/id/${user._id}`);
      history.replace("/");
    } catch {
      alert("Something failed while deleting a user");
    }
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit} noValidate>
      <TextField
        id="fullName"
        name="fullName"
        label="Name"
        variant="filled"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        fullWidth
      />
      <TextField
        id="email"
        name="email"
        label="Email"
        variant="filled"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        id="phone"
        name="phone"
        label="Phone Number"
        variant="filled"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        fullWidth
      />
      <Grid
        container
        spacing={0}
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        alignContent="stretch"
        wrap="nowrap"
      >
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          variant="outlined"
          color="primary"
          disabled={!user || active}
        >
          Delete
        </Button>
      </Grid>
    </form>
  );
}

export default UserForm;
