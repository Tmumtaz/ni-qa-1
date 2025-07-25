import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  multiline: {
    marginTop: 0,
    marginBottom: 0,
  },
}));

function UsersListItem({ onDelete, user }) {
  const classes = useStyles();

  return (
    <div>
      <ListItem>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs style={{ flexGrow: 1 }}>
            <ListItemText
              className={classes.multiline}
              primary={user.fullName}
              secondary={`${user.email} | ${user.phone}`}
            />
          </Grid>
          <Grid item m={2}>
            <Button
              component={Link}
              to={{ pathname: "/edit", userId: user._id }}
              m={2}
              variant="outlined"
              color="primary"
            >
              Edit
            </Button>
          </Grid>
          <Grid item m={2}>
            <Button
              onClick={() => onDelete(user._id)}
              m={2}
              variant="outlined"
              color="primary"
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </ListItem>
      <Divider />
    </div>
  );
}

export default UsersListItem;
