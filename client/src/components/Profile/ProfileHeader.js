import Skeleton from "react-loading-skeleton";
import axios from "axios";

function ProfileHeader({
  userProfile,
  setUserProfile,
  state,
  dispatch,
  userId,
}) {
  //   const [showfollow, setShowFollow] = useState(
  //     state ? !state.following.includes(userId) : true
  //   );

  // console.log("userProfile at the Profile Header section", userProfile);
  // console.log("state at the Profile Header section", state);

  const followUser = () => {
    // console.log("firing a follow user request");
    axios({
      method: "PUT",
      url: "/api/profile/follow",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      data: JSON.stringify({
        followId: userId,
      }),
    }).then((response) => {
      // console.log(response);
      dispatch({
        type: "UPDATE",
        payload: {
          following: response.data.following,
          followers: response.data.followers,
        },
      });
      localStorage.setItem("user", JSON.stringify(response.data));
      setUserProfile((prevState) => {
        return {
          ...prevState,
          findUser: {
            ...prevState.findUser,
            followers: [...prevState.findUser.followers, response.data._id],
          },
        };
      });
    });
  };

  const unfollowUser = () => {
    // console.log("firing an unfollow user request");
    fetch("/api/profile/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: {
            following: data.following,
            followers: data.followers,
          },
        });
        localStorage.setItem("user", JSON.stringify(data));

        setUserProfile((prevState) => {
          // console.log(prevState);
          const newFollower = prevState.findUser.followers.filter(
            (item) => item !== data._id
          );
          return {
            ...prevState,
            findUser: {
              ...prevState.findUser,
              followers: newFollower,
            },
          };
        });
      });
  };

  // console.log("userProfile at 104", userProfile);

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {userProfile ? (
          <img
            className="rounded-full h-16 w-16 md:h-20 lg:h-40 md:w-20 lg:w-40 flex"
            alt="logged in user profile pic"
            src={userProfile?.findUser?.picture}
          />
        ) : (
          <img
            className="rounded-full h-16 w-16 md:h-20 lg:h-40 md:w-20 lg:w-40 flex"
            alt={`my profile pic`}
            src="/images/avatars/darryl.jpg"
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{userProfile?.findUser?.name}</p>
          {state?.following.includes(userId) ? (
            <button
              className="bg-blue-500 font-bold text-sm rounded text-white w-20 h-8"
              type="button"
              onClick={unfollowUser}
            >
              Unfollow
            </button>
          ) : (
            <button
              className="bg-blue-500 font-bold text-sm rounded text-white w-20 h-8"
              type="button"
              onClick={followUser}
            >
              Follow
            </button>
          )}
        </div>
        <div className="container flex mt-4 flex-col lg:flex-row">
          {!userProfile ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <p className="mr-10">
                <span className="font-bold">
                  {userProfile.findPosts.length}
                </span>{" "}
                photos
              </p>
              <p className="mr-10">
                <span className="font-bold">
                  {userProfile.findUser.followers.length}
                </span>
                {` `}
                {userProfile.findUser?.followers.length === 1
                  ? `follower`
                  : `followers`}
              </p>
              <p className="mr-10">
                <span className="font-bold">
                  {userProfile.findUser.following.length}
                </span>{" "}
                following
              </p>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!userProfile ? (
              <Skeleton count={1} height={24} />
            ) : (
              userProfile.findUser?.email
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;
