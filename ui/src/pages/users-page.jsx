import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import UsersList from "../components/users-list/users-list";
import UsersListItem from "../components/users-list/users-list-item";
import CircularProgress from "@material-ui/core/CircularProgress";
import axios from "axios";
import config from "../config.json";

import Grid from "@material-ui/core/Grid";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => { // eslint-disable-line
      try {
        const { data: users } = await axios.get(config.ApiURL + "/id");
        setUsers(users);
      } catch (err) {
        console.log(err);
        // Fallback to empty array if API fails
        setUsers([]);
      }
    };

    getUsers(); // Re-enabled for local API
  }, []);

  const handleDelete = async (userId) => {
    const originalUsers = users;
    const updatedUsers = users.filter((u) => u._id !== userId);
    setUsers(updatedUsers);

    try {
      await axios.delete(config.ApiURL + `/user/${userId}`);
    } catch {
      alert("Something failed while deleting a user");
      setUsers(originalUsers);
    }
  };

  return (
    <Layout>
      <Grid container justifyContent="center">
        <Grid item xs={9}>
          {users.length > 0 ? (
            <UsersList>
              {users.map((user) => {
                return (
                  <UsersListItem
                    key={user._id}
                    onDelete={handleDelete}
                    user={user}
                  />
                );
              })}
            </UsersList>
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default UsersPage;
