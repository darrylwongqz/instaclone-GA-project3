import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import axios from "axios";
import UserContext from "../context/user";

export default function Login() {
  const { dispatch } = useContext(UserContext);
  const history = useHistory();

  // console.log("state at login page", state);

  //field value states
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");

  //Field validation states
  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "";

  const handleLogin = async (event) => {
    event.preventDefault();
    const userWhoIsTryingToSignIn = {
      method: "POST",
      url: "/api/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email: emailAddress,
        password,
      },
    };
    axios(userWhoIsTryingToSignIn)
      .then((response) => {
        // console.log("response.data of auth", response.data);
        localStorage.setItem("jwt", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch({ type: "USER", payload: response.data.user });
        //user state gets updated to the user and transferred to relevant componenets through the context api
        console.log("successfully logged in");
      })
      .then((response) => {
        history.push(ROUTES.DASHBOARD);
      })
      .catch((error) => {
        // console.log("login error being fired", error);
        setEmailAddress("");
        setPassword("");
        setError("Invalid Email or Password. Please try again.");
      });
  };

  //document title change
  useEffect(() => {
    document.title = "Login - Instagram Clone";
  }, []);

  return (
    <div className="container flex flex-col lg:flex-row mx-auto max-w-screen-md items-center h-screen px-4 lg:px-0">
      <div className="hidden lg:flex w-5/5 lg:w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col w-full lg:w-2/5 justify-center h-full max-w-md m-auto">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-300 mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img src="/images/logo.png" alt="Instagram" className="mt-2 mb-4" />
          </h1>

          {error && (
            <p data-testid="error" className="mb-4 text-xs text-red-400">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} method="POST" data-testid="login">
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
              className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-300 rounded mb-2"
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-300 rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-500 text-white w-full rounded h-8 font-bold
          ${isInvalid && "opacity-50"}`}
            >
              Login
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-300">
          <p className="text-sm">
            Don't have an account?{` `}
            <Link
              to={ROUTES.SIGN_UP}
              className="font-bold text-blue-500"
              data-testid="sign-up"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
