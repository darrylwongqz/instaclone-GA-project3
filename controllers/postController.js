const express = require("express");
const controller = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../models/post");

// SHOW ALL POSTS

controller.get(
  "/posts/all",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const posts = await Post.find({})
        .populate([
          {
            path: "postedBy",
            select: ["_id", "name", "picture"],
          },
          {
            path: "comments.postedBy",
            select: ["_id", "name", "picture"],
          },
        ])
        .sort("-updatedAt");
      // returns list of all posts currently available on the app
      res.json(posts);
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);

// GET ALL POSTS FOR THE PEOPLE YOU FOLLOW
controller.get(
  "/posts/following",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const followingPost = await Post.find({
        postedBy: {
          $in: req.user.following,
        },
      })
        .populate([
          {
            path: "postedBy",
            select: ["_id", "name", "picture"],
          },
          {
            path: "comments.postedBy",
            select: ["_id", "name", "picture"],
          },
        ])
        .sort("-updatedAt");

      if (!followingPost) {
        res.status(422).json({
          error:
            "Something went wrong when fetching your follow list. Please try again later.",
        });
      } else {
        res.json(followingPost);
      }
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);

// GET ALL POSTS FOR A PARTICULAR USER

controller.get(
  "/posts/myposts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // console.log(req.user._id);

      const myPosts = await Post.find({ postedBy: req.user._id }).populate([
        {
          path: "postedBy",
          select: ["_id", "name", "picture"],
        },
      ]);
      // Return list of posts associated to the user who is currently using the app
      return res.json(myPosts);
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);

// CREATE NEW POST
controller.post(
  "/posts/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { caption, image } = req.body;
      if (!caption || !image) {
        return res.status(422).json({
          error:
            "Fields are missing. Please ensure you add all necessary fields",
        });
      }
      // To remove the hashed password from the return statement
      req.user.password = undefined;
      try {
        const inputs = {
          // title: title,
          caption: caption,
          image: image,
          postedBy: req.user,
        };

        const post = await Post.create(inputs);
        // returns new post object to the requester after successful post
        return res.json(post);
      } catch (e) {
        return res.status(400).json({
          name: e.name,
          message: e.message,
        });
      }
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);

// LIKE A POST
controller.put(
  "/posts/like",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const postToLike = await Post.findByIdAndUpdate(
        req.body.postId,
        {
          // addToSet operator adds a value to an array unless the value is already present, in which case $addToSet does nothing to that array.
          $addToSet: { likes: req.user._id },
        },
        {
          new: true,
        }
      );

      // console.log(postToLike)

      if (postToLike) {
        // returns entire post that was like by the user
        return res.json(postToLike);
      } else {
        return res.status(422).json({
          error: "Sorry, unable to like the post. Please try again later.",
        });
      }
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);

// REMOVE LIKE FROM POST
controller.put(
  "/posts/unlike",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const postToUnLike = await Post.findByIdAndUpdate(
        req.body.postId,
        {
          // pull operator removes from an existing array all instances of a value or values that match a specified condition.
          $pull: { likes: req.user._id },
        },
        {
          new: true,
        }
      );

      // console.log(postToLike)

      if (postToUnLike) {
        // returns entire post that was just unliked by the user
        return res.json(postToUnLike);
      } else {
        return res.status(422).json({
          error: "Sorry, unable remove like the post. Please try again later.",
        });
      }
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);

// COMMENT ROUTE
controller.put(
  "/posts/comment",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const newComment = {
        text: req.body.text,
        postedBy: req.user._id,
      };

      const addNewComment = await Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { comments: newComment },
        },
        {
          new: true,
        }
      ).populate([
        {
          // info on who created the comment for the post
          path: "comments.postedBy",
          select: ["_id", "name", "picture"],
        },
        {
          // info on who created the post that user is commenting on
          path: "postedBy",
          select: ["_id", "name", "picture"],
        },
      ]);

      if (addNewComment) {
        // returns the comment, the name, id and picture of commenter
        return res.json(addNewComment);
      } else {
        return res.status(422).json({
          error:
            "Sorry, unable to comment on the post. Please try again later.",
        });
      }
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);

// DELETE THE POST
controller.delete(
  "/posts/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const deletePost = await Post.findById(req.params.id).populate([
        {
          path: "postedBy",
          select: ["_id", "name"],
        },
      ]);

      if (!deletePost) {
        res.status(422).json({ error: "We cannot find this post to delete." });
      } else {
        if (deletePost.postedBy._id.toString() === req.user._id.toString()) {
          try {
            await Post.deleteOne({
              _id: req.params.id,
            });

            res.status(200).json({ message: "Post deleted!" });
          } catch (e) {
            return res.status(400).json({
              name: e.name,
              message: e.message,
            });
          }
        }
      }
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);

module.exports = controller;
