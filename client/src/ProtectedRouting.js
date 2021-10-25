import { lazy, useEffect, useContext, Fragment } from "react";
import { BrowserRouter as Route, Switch, useHistory } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import UserContext from "./context/user";

import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import MyProfile from "./pages/myprofile";

//Enables lazy loading --> splits build into separate js bundles that will be delivered on demand vs one whole pack
//Improves performance of app once it gets bigger

// const Login = lazy(() => import("./pages/login"));
// const SignUp = lazy(() => import("./pages/sign-up"));
// const Dashboard = lazy(() => import("./pages/dashboard"));
// const Profile = lazy(() => import("./pages/profile"));
// const NotFound = lazy(() => import("./pages/not-found"));

const ProtectedRouting = () => {
  // const history = useHistory();
  // const { state, dispatch } = useContext(UserContext);

  // console.log("state at ProtectedRouting", state);

  //   If there is no truthy value for user, redirect him/her to sign in page.
  //   Note that this routing component wraps around the rest of the routes, meaning the user should be redirected to the sign in page if he/she doesn't have the jwt token.

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));

  //   console.log("I am getting fired useEffect protected");
  //   if (user) {
  //     dispatch({ type: "USER", payload: user });
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!state && !history.location.pathname.startsWith(ROUTES.RESET))
  //     history.push(ROUTES.LOGIN);
  // }, [state]);

  //   export const DASHBOARD = "/";
  // export const LOGIN = "/login";
  // export const SIGN_UP = "/sign-up";
  // export const PROFILE = "/profile/:username";
  // export const NOT_FOUND = "/not-found";
  // export const MYPROFILE = "/profile";
  // export const RESET = "/reset";

  return (
    <Fragment>
      {/* <Route path={ROUTES.PROFILE}>
        <Profile />
      </Route>
      <Route exact path={ROUTES.DASHBOARD}>
        <Dashboard />
      </Route>
      <Route exact path={ROUTES.MYPROFILE}>
        <MyProfile />
      </Route> */}
    </Fragment>
  );
};

export default ProtectedRouting;
