import React, { useContext } from "react";
import Skeleton from "react-loading-skeleton";
import { useRecoilState } from "recoil";
import UserContext from "../../context/user";
import { PencilIcon } from "@heroicons/react/outline";
import { profileModalState } from "../../atoms/modalAtom";

function ProfileHeader({ photosCount }) {
  const { state } = useContext(UserContext);
  const [open, setOpen] = useRecoilState(profileModalState);

  // console.log("myPosts at profile header", myPosts.myPosts);

  // console.log("state at profile-header", state);

  const updatePhoto = () => {
    setOpen(true);
  };

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {state ? (
          <img
            className="rounded-full h-16 w-16 md:h-20 lg:h-40 md:w-20 lg:w-40 flex"
            alt="logged in user profile picture"
            src={state?.picture}
          />
        ) : (
          <img
            className="rounded-full h-16 w-16 md:h-20 lg:h-40 md:w-20 lg:w-40 flex"
            alt={`my profile picture`}
            src="/images/avatars/darryl.jpg"
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{state?.name}</p>
          <button>
            <PencilIcon
              className="font-bold text-sm rounded text-gray-800 w-5 h-8"
              onClick={updatePhoto}
            />
          </button>
          {/* {activeBtnFollow && (
          <button
            className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
            type="button"
            onClick={`insert follow and unfollow functionality`}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleToggleFollow();
              }
            }}
          >
            {isFollowingProfile ? 'Unfollow' : 'Follow'}
          </button>
        )} */}
        </div>
        <div className="container flex mt-4 flex-col lg:flex-row">
          {!state?.followers || !state?.following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">{photosCount}</span> photos
              </p>
              <p className="mr-10">
                <span className="font-bold">{state.followers.length}</span>
                {` `}
                {state?.followers.length === 1 ? `follower` : `followers`}
              </p>
              <p className="mr-10">
                <span className="font-bold">{state.following.length}</span>{" "}
                following
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!state?.email ? <Skeleton count={1} height={24} /> : state?.email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
