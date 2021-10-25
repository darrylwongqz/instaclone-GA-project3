import React, { useState, useEffect } from "react";
import faker from "faker";
import Story from "./Story";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";

function Stories({ state }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const suggestions = [...Array(20)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }));
    // console.log(suggestions);
    setSuggestions(suggestions);
  }, []);

  return (
    <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
      {state && (
        <Link to={ROUTES.MYPROFILE}>
          <Story img={state.picture} username={state.name} />
        </Link>
      )}

      {suggestions.map((profile) => (
        <Story
          key={profile.id}
          img={profile.avatar}
          username={profile.username}
        />
      ))}
    </div>
  );
}

export default Stories;
