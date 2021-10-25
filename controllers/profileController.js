const express = require("express");
const controller = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = require("../models/post");
const User = require("../models/user");

// GET SUGGESTED PROFILES FOR A PARTICULAR USER
controller.get(
  "/profile/recommended-users",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Get a list of the following users for the logged in user
      
      const listOfFollowing = await User.findById(
        req.user._id,
        "following -_id"
      );
      // Set a new list that only contains an array for following ids, this is to be used for the next query
      const newListOfFollowing = listOfFollowing.following;
      // console.log(newListOfFollowing);

      // Find the list of users that the logged in is not following and don't include the users only id. Return first ten
      const listToRecommend = await User.find(
        {
          $and: [
            {
              _id: {
                $nin: newListOfFollowing,
              },
            },
            {
              _id: {
                $ne: req.user._id,
              },
            },
          ],
        },
        "-password"
      ).limit(10);
      if (listToRecommend) {
        return res.json(listToRecommend);
      } else {
        return res.status(422).json({
          error: "Sorry, no one to recommend",
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

// FIND USER INFO ROUTE, TO POPULATE PROFILE PAGE
controller.get(
  "/profile/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const findUser = await User.findById(req.params.id, "-password");
      if (!findUser) {
        return res.status(422).json({ error: "Sorry, user not found." });
      } else {
        try {
          const findPosts = await Post.find({
            postedBy: req.params.id,
          }).populate([
            {
              path: "postedBy",
              select: ["_id", "name"],
            },
          ]);

          if (!findPosts) {
            return res.status(422).json({
              error: "Unable to retrieve posts for user. Please try again.",
            });
          } else {
            // returns details on queried user and all associated posts for said user
            return res.json({ findUser, findPosts });
          }
        } catch (e) {
          return res.status(400).json({
            name: e.name,
            message: e.message,
          });
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



// FOLLOW ROUTE - UPDATES LIST OF FOLLOWERS AND FOLLOWING
controller.put(
  "/profile/follow",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Update the list of followers for a user that the logged in user is trying to follow
      const updateFollowers = await User.findByIdAndUpdate(
        { _id: req.body.followId },
        {
          $addToSet: { followers: req.user._id },
        },
        {
          new: true,
        }
      );

      if (!updateFollowers) {
        res
          .status(422)
          .json({ error: "Unable to follow this user. Try again later." });
      } else {
        try {
          // Update the list of following for the current logged in user
          const updateFollowing = await User.findByIdAndUpdate(
            req.user._id,
            // "-password",
            {
              $addToSet: { following: req.body.followId },
            },
            {
              new: true,
              select: "-password",
            }
          );
          if (!updateFollowing) {
            return res
              .status(422)
              .json({ error: "Unable to follow this user. Try again later." });
          } else {
            return res.json(updateFollowing);
          }
        } catch (e) {
          return res.status(400).json({
            name: e.name,
            message: e.message,
          });
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

// UNFOLLOW ROUTE - UPDATES LIST OF FOLLOWERS AND FOLLOWING
controller.put(
  "/profile/unfollow",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      // Update the list of followers for a user that the logged in user is trying to follow
      const updateFollowers = await User.findByIdAndUpdate(
        { _id: req.body.followId },
        {
          $pull: { followers: req.user._id },
        },
        {
          new: true,
        }
      );

      if (!updateFollowers) {
        return res
          .status(422)
          .json({ error: "Unable to unfollow this user. Try again later." });
      } else {
        try {
          // Update hte list of following for the current logged in user
          const updateFollowing = await User.findByIdAndUpdate(
            req.user._id,
            // "-password",
            {
              $pull: { following: req.body.followId },
            },
            {
              new: true,
              select: "-password",
            }
          );
          if (!updateFollowing) {
            return res.status(422).json({
              error: "Unable to unfollow this user. Try again later.",
            });
          } else {
            return res.json(updateFollowing);
          }
        } catch (e) {
          return res.status(400).json({
            name: e.name,
            message: e.message,
          });
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

// UPDATE PROFILE PICTURE
controller.put(
  "/profile/update-picture",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const updatePicture = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: { picture: req.body.picture },
        },
        {
          new: true,
          select: "-password",
        }
      );

      if (!updatePicture) {
        return res.status(422).json({
          error: "Unable to update your picture. Please try again later.",
        });
      } else {
        // Passes the entire user profile with the update profile picture (minus the password)
        return res.json(updatePicture);
      }
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  }
);



// SEARCH USER END POINT
controller.post(
  "/profile/search-user",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let userPattern = new RegExp("^" + req.body.query);
    const foundUsers = await User.find(
      {
        $or: [
          {
            email: userPattern,
          },
          {
            name: userPattern,
          },
        ],
      },
      "_id name email picture"
    );
    if (!foundUsers) {
      return res.status(422).json({ error: "Sorry, no user found." });
    } else {
      return res.json(foundUsers);
    }
  }
);

module.exports = controller;
