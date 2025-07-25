import { Route, Switch } from "react-router-dom";
import HomePage from "./pages/home-page";
import UsersPage from "./pages/users-page";
import UserPage from "./pages/user-page";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route exact path="/users">
        <UsersPage />
      </Route>
      <Route exact path="/edit">
        <UserPage />
      </Route>
    </Switch>
  );
}

export default App;
