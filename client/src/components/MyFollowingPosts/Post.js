import React, { useState } from "react";

import {
  BookmarkIcon,
  ChatIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
  BackspaceIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

import axios from "axios";

export default function Post({
  id,
  username,
  userImg,
  img,
  caption,
  data,
  state,
  deletePost,
  posterId,
}) {
  const [comment, setComment] = useState("");
  const [likes, setLikes] = useState(data.likes);
  const [comments, setComments] = useState(data.comments);

  // console.log("postData at individual post component", postData);

  const unlikePost = () => {
    // console.log("unlike post functionality");
    axios({
      method: "PUT",
      url: "/api/posts/unlike",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      data: JSON.stringify({ postId: id }),
    })
      .then((response) => {
        console.log("response.data of setting unlike post", response.data);
        setLikes(response.data.likes);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  const likePost = () => {
    // console.log("like post functionality triggered");
    axios({
      method: "PUT",
      url: "/api/posts/like",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      data: JSON.stringify({ postId: id }),
    })
      .then((response) => {
        // console.log("response.data of setting like post", response.data);
        setLikes(response.data.likes);
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  };

  const sendComment = (e) => {
    // console.log("sendComment functionality triggered");
    e.preventDefault();
    axios({
      method: "PUT",
      url: "/api/posts/comment",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      data: JSON.stringify({
        postId: id,
        text: comment,
      }),
    })
      .then((response) => {
        // console.log(
        //   "response.data of send Comment",
        //   response.data.addNewComment.comments
        // );
        setComments(response.data.comments);
        setComment("");
      })
      .catch((err) => {
        if (err) {
          console.log(err);
          setComment("");
        }
      });
  };

  return (
    <div className="bg-white my-7 border rounded-sm">
      {/* Header */}
      <div className="flex items-center p-5">
        <Link to={`/profile/${posterId}`}>
          <img
            src={userImg}
            alt=""
            className="rounded-full h-12 w-12 object-contain border p-1 mr-3"
          />
        </Link>
        <p className="flex-1 font-bold">{username}</p>
        {/* <DotsHorizontalIcon className="h-5" /> */}
        {data.postedBy._id === state?._id && (
          <BackspaceIcon
            className="h-5 cursor-pointer"
            onClick={() => deletePost(id)}
          />
        )}
      </div>

      {/* img */}
      <img src={img} alt="" className="object-cover w-full"></img>

      {/* buttons */}

      <div className="flex justify-between px-4 pt-4">
        <div className="flex space-x-4">
          {likes.includes(state?._id) ? (
            <HeartIconFilled
              onClick={unlikePost}
              className="btn text-red-500"
            />
          ) : (
            <HeartIcon className="btn" onClick={likePost} />
          )}
          <ChatIcon className="btn" />
          <PaperAirplaneIcon className="btn" />
        </div>
        <BookmarkIcon className="btn" />
      </div>

      {/* caption */}
      <p className="p-5 truncate">
        {likes.length > 0 && (
          <p className="font-bold mb-1">
            {likes.length} {likes.length === 1 ? "like" : "likes"}
          </p>
        )}
        <span className="font-bold mr-1">{username}</span>
        {caption}
      </p>
      {/* comments */}
      {
        /* comments */
        comments.length > 0 && (
          <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-center space-x-2 mb-3"
              >
                <Link to={`/profile/${comment.postedBy._id}`}>
                  <img
                    className="rounded-full h-7"
                    src={comment.postedBy.picture}
                    alt=""
                  />
                </Link>
                <p className="text-sm flex-1">
                  <span className="font-bold">{comment.postedBy.name} </span>
                  {comment.text}
                </p>
                {/* <Moment fromNow className="pr-5 text-xs ">
                  {comment.data().timestamp?.toDate()}
                </Moment> */}
              </div>
            ))}
          </div>
        )
      }

      {/* input box */}

      <form className="flex items-center p-4">
        <EmojiHappyIcon className="h-7" />
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="border-none flex-1 focus:ring-0 outline-none"
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          onClick={sendComment}
          className="font-semibold text-blue-400"
        >
          Post
        </button>
      </form>
    </div>
  );
}
