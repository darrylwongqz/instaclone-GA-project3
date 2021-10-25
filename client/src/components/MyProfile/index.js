import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/user";
import PhotosCollection from "./PhotosCollection";
import ProfileModal from "./ProfileModal";

function MyProfile() {
  const [myPosts, setMyPosts] = useState([]);
  const { state } = useContext(UserContext);
  const history = useHistory();

  // console.log("state at myprofile index page", state);

  useEffect(() => {
    axios({
      method: "GET",
      url: "/api/posts/myposts",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    }).then((response) => {
      // console.log("/mypostsapireponse", response);
      setMyPosts(response.data);
    });
  }, []);
  // console.log(myPosts);

  return (
    <>
      {/* Header - props to pass: photos collection -for length, name, picture, followers array, following array */}
      <ProfileHeader
        state={state}
        history={history}
        photosCount={myPosts ? myPosts.length : 0}
      />
      {/* photos */}
      <PhotosCollection myPosts={myPosts} />
      <ProfileModal />
    </>
  );
}

export default MyProfile;
