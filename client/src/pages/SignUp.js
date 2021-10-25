import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import { CameraIcon } from "@heroicons/react/outline";
import axios from "axios";

export default function SignUp() {
  const history = useHistory();

  //field value states
  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(undefined);

  //Field validation states
  const [error, setError] = useState("");
  const isInvalid = password === "" || emailAddress === "" || username === "";

  //After we get back the profile pic url, we will fire off the uploadFields function because now profilePicUrl will be set to cloudinary Url
  useEffect(() => {
    // Posting image to cloudinary (separate from DB) - you only want to save the image URL in the DB,
    // but only if the rest of the required fields are present
    if (profilePicUrl) {
      uploadFields();
    }
  }, [profilePicUrl]);
  //Helper functions

  const uploadProfilePic = () => {
    // Posting image to cloudinary (separate from DB) - you only want to save the image URL in the DB,
    //if pass validation upload the photo to cloudinary
    if (isInvalid) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("upload_preset", "insta-clone-v0.1");
    formData.append("cloud_name", "darrylwongqz");
    axios({
      method: "POST",
      url: "https://api.cloudinary.com/v1_1/darrylwongqz/image/upload",
      data: formData,
    })
      .then((response) => setProfilePicUrl(response.data.secure_url))
      .catch((error) => console.log(error.response.data.error));
  };

  const uploadFields = async (event) => {
    const userWhoIsSigningUp = {
      method: "POST",
      url: "/api/auth/register",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        name: username,
        email: emailAddress,
        password,
        picture: profilePicUrl,
      },
    };

    axios(userWhoIsSigningUp)
      .then((response) => history.push(ROUTES.LOGIN))
      .catch((error) => {
        if (error.response) {
          setUsername("");
          setEmailAddress("");
          setPassword("");
          setSelectedFile(null);
          setError(error.response.data.error);
        }
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (selectedFile) {
      uploadProfilePic();
    } else {
      uploadFields();
      history.push(ROUTES.LOGIN);
      // if user decides not to upload a profile picture, we will still allow user to register
    }
  };

  const addImageToForm = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      console.log(readerEvent.target.result);
      setSelectedFile(readerEvent.target.result);
    };
  };

  return (
    <div className="container flex mx-auto max-w-screen-md items-center h-screen px-4 lg:px-0">
      {/* Left hand side */}
      <div className="hidden lg:flex w-full lg:w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
          className="object-scale-down"
        />
      </div>

      {/* Right hand side */}
      <div className="flex flex-col w-full lg:w-2/5 justify-center h-full max-w-md m-auto">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-300 mb-4 rounded">
          {/* Instagram Logo */}
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="Instagram"
              className="mt-2 mb-4 object-scale-down"
            />
          </h1>

          {/* Error message upon failing validation */}
          {error && (
            <p data-testid="error" className="mb-4 text-xs text-red-400">
              {error}
            </p>
          )}

          {/* Profile image uploader */}
          {selectedFile ? (
            <img
              onClick={() => setSelectedFile(null)}
              className="w-full object-contain cursor-pointer"
              src={selectedFile}
              alt=""
            />
          ) : (
            <div
              onClick={() => filePickerRef.current.click()}
              className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer"
            >
              <CameraIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
            </div>
          )}
          <div className="text-lg leading-6 font-medium text-gray-900 mb-3">
            <h3>Upload a profile photo</h3>
          </div>

          {/* Form inputs */}
          <form onSubmit={handleSignUp} method="POST" data-testid="sign-up">
            <input
              ref={filePickerRef}
              type="file"
              hidden
              onChange={addImageToForm}
            />
            <input
              aria-label="Enter your username"
              type="text"
              placeholder="Username"
              className="text-sm text-gray-500 w-full mr-3 py-5 px-4 h-2 border border-gray-300 rounded mb-2"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
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
              Sign Up
            </button>
          </form>
        </div>

        {/* Bottom box */}
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-300">
          <p className="text-sm">
            Have an account?{` `}
            <Link
              to={ROUTES.LOGIN}
              className="font-bold text-blue-500"
              data-testid="login"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
