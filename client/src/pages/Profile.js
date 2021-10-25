import React from "react";
import Header from "../components/Header";
import Modal from "../components/Header/Modal";
import SearchingModal from "../components/Header/SearchingModal";
import Profile from "../components/Profile";
// import UserContext from "../context/user";

function Myprofile() {
  // const { state, dispatch } = useContext(UserContext);

  return (
    <div>
      <Header />
      <div className="mx-auto my-8 max-w-screen-lg">
        <Profile />
        <Modal />
        <SearchingModal />
      </div>
    </div>
  );
}

export default Myprofile;
