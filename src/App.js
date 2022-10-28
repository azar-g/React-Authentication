import { Switch, Route } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./components/store/AuthContext";
import { useContext } from "react";

function App() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        <Route path="/auth">
          <AuthPage />
        </Route>
        {isLoggedIn ? (
          <Route path="/profile">
            <UserProfile />
          </Route>
        ) : (
          <div className="centered">
            <p>Only authorized user's area</p>
          </div>
        )}
      </Switch>
    </Layout>
  );
}

export default App;
