import { useContext } from "react";
import User from "./User";
import Suggestions from "./Suggestions";
import UserContext from "../../context/user";

function Sidebar() {
  const { state, dispatch } = useContext(UserContext);

  const { name, picture } = state ? state : {};

  // console.log("state at Sidebar Component", state);

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "CLEAR" });
  };

  return (
    <div>
      <User name={name} picture={picture} handleLogout={handleLogout} />
      <Suggestions />
    </div>
  );
}

export default Sidebar;
