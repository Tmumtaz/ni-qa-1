import React from "react";
import Layout from "../components/layout";
import UserForm from "../components/user-form";
import Grid from "@material-ui/core/Grid";

const HomePage = (params) => {
  return (
    <Layout>
      <Grid container spacing={2} direction="column" alignContent="center">
        <Grid item xs={10} md={8} lg={6}>
          <UserForm />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default HomePage;
