import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
// import * as ROUTES from "../../constants/routes";

// import SuggestedProfiles from "./suggested-profiles";

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // console.log("useEffect at suggestions getting fired");
    axios({
      method: "GET",
      url: `/api/profile/recommended-users`,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => {
        // console.log(
        //   "suggestions response at sidebar GET request",
        //   response.data
        // );
        setSuggestions(response.data);
      })
      .catch((error) => {
        if (error) {
          console.log(error);
        }
      });
  }, []);

  // console.log(suggestions);

  return !suggestions ? (
    <Skeleton count={1} height={150} className="mt-5" />
  ) : (
    <div className="mt-4 ml-10">
      <div className="flex justify-between text-sm mb-5">
        <h3 className="text-sm font-bold text-gray-400">Suggestions for you</h3>
        <button className="text-gray-600 font-semibold">See All</button>
      </div>

      {suggestions.map((profile) => (
        <div key={profile._id} className="flex items-center mt-3">
          <Link to={`/profile/${profile._id}`}>
            <img
              className="w-10 h-10 rounded-full border p-[2px]"
              src={profile.picture}
              alt=""
            />
          </Link>
          <div className="flex-1 ml-4">
            <h2 className="font-semibold text-sm">{profile.name}</h2>
            <h3 className="text-xs text-gray-400">{profile.email}</h3>
          </div>

          <button
            className="text-blue-400 text-xs font-bold"
            onClick={() => history.push(`/profile/${profile._id}`)}
          >
            View Profile
          </button>
        </div>
      ))}
    </div>
  );
}

export default Suggestions;
