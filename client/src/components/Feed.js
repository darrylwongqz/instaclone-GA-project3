import React, { useContext } from "react";
import UserContext from "../context/user";
import Stories from "./Stories";
import Posts from "./Posts";
import Sidebar from "./Sidebar";

function Feed() {
  const { state } = useContext(UserContext);

  // console.log("state at Feed componenet", state);

  return (
    <main
      className={`grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:max-w-6xl mx-auto ${
        !state && "!grid-cols-1 !max-w-3xl"
      }`}
    >
      <section className="col-span-2">
        {/* Stories */}
        <Stories state={state} />

        {/* Posts */}
        <Posts />
      </section>

      {state && (
        <section className="hidden xl:inline-grid md:col-span-1">
          <div className="fixed">
            <Sidebar />
          </div>
          {/* Mini Profile */}
          {/* Suggestions */}
        </section>
      )}
    </main>
  );
}

export default Feed;
