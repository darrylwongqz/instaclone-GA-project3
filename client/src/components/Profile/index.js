import React, { useState, useLayoutEffect, useEffect, useContext } from "react";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";
import { useHistory, useParams } from "react-router-dom";
import UserContext from "../../context/user";
import PhotosCollection from "./PhotosCollection";
import * as ROUTES from "../../constants/routes";

function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const { userId } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  // console.log("state at other user profile index page", state);

  useLayoutEffect(() => {
    // console.log("useLayoutEffect to redirect to myprofile page fired");
    if (userId === state._id) history.push(ROUTES.MYPROFILE);
  }, []);

  useEffect(() => {
    axios({
      method: "GET",
      url: `/api/profile/${userId}`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((response) => {
      // console.log("/mypostsapireponse", response.data);
      setUserProfile(response.data);
    });
  }, []);
  // console.log(
  //   "userProfile from GET request from /api/profile/:userId",
  //   userProfile
  // );

  return (
    <>
      {/* Header - props to pass: photos collection -for length, name, picture, followers array, following array */}
      <ProfileHeader
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        state={state}
        dispatch={dispatch}
        userId={userId}
      />
      {/* photos */}
      <PhotosCollection userProfile={userProfile} />
    </>
  );
}

export default Profile;
