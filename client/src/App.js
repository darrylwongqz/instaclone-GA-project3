import { Suspense, useReducer } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import Spinner from "./components/Spinner";
import { userReducer, initialState } from "./reducers/userReducer";
import UserContext from "./context/user";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Myprofilepage from "./pages/Myprofilepage";
import ProtectedRoute from "./utils/ProtectedRoute";
import { MyFollowingDashboardPage } from "./pages/MyFollowingDashboardPage";

import { RecoilRoot } from "recoil";

// const Login = lazy(() => import("./pages/login"));
// const SignUp = lazy(() => import("./pages/sign-up"));
// const Dashboard = lazy(() => import("./pages/dashboard"));
// const Profile = lazy(() => import("./pages/profile"));
// const NotFound = lazy(() => import("./pages/not-found"));

export default function App() {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // console.log("state at App.js", state);

  // useEffect(() => {
  //   if (!state && !history.location.pathname.startsWith(ROUTES.RESET))
  //     history.push(ROUTES.LOGIN);
  // }, [state]);
  //   export const DASHBOARD = "/";
  // export const LOGIN = "/login";
  // export const SIGN_UP = "/sign-up";
  // export const PROFILE = "/profile/:userId";
  // export const NOT_FOUND = "/not-found";
  // export const MYPROFILE = "/profile";
  // export const RESET = "/reset";

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <RecoilRoot>
        <Router>
          <Suspense fallback={<Spinner />}>
            <Switch>
              <Route exact path={ROUTES.LOGIN}>
                <Login />
              </Route>
              <Route exact path={ROUTES.SIGN_UP}>
                <SignUp />
              </Route>
              <ProtectedRoute user={state} exact path={ROUTES.MYPROFILE}>
                <Myprofilepage />
              </ProtectedRoute>{" "}
              <ProtectedRoute user={state} exact path={ROUTES.PROFILE}>
                <Profile />
              </ProtectedRoute>
              <ProtectedRoute user={state} path={ROUTES.DASHBOARD} exact>
                <Dashboard />
              </ProtectedRoute>
              <ProtectedRoute
                user={state}
                path={ROUTES.MYFOLLOWINGDASHBOARD}
                exact
              >
                <MyFollowingDashboardPage />
              </ProtectedRoute>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
        </Router>
      </RecoilRoot>
    </UserContext.Provider>
  );
}
