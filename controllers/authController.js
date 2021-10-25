const express = require("express");
const controller = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, SENDGRID_API, EMAIL } = require("../config/keys");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

// Helper funciton to send the welcome email
const emailNewUser = (newUserEmail) => {
  // console.log(newUserEmail)
  transporter.sendMail({
    to: newUserEmail,
    from: "atulnk1@gmail.com",
    subject: "Welcome to InstaClone!",
    html: `<h1>Welcome to InstaClone!</h1>
    <h3>Find out more about the what people are doing around you!</h3>
    <h4>With InstaClone, you can:</h4>
    <ul>
    <li>Create posts</li>
    <li>See what everyone else is posting</li>
    <li>Follow your favourite influencers</li>
    <li>Like the posts that interest you</li>
    <li>Comment on other people posts</li>
    </ul>`,
  });
};
// Helper function to send the password reset email
const passwordReset = (passwordResetEmail, resetToken) => {
  // console.log(passwordResetEmail)
  transporter.sendMail({
    to: passwordResetEmail,
    from: "atulnk1@gmail.com",
    subject: "Password Reset Request",
    html: `<h1>There was a request to reset your password with this email address</h1>
        <h3>Please click this <a href="${EMAIL}/reset/${resetToken}">link</a> to reset your password`,
  });
};
// SIGN UP ROUTE - WILL TAKE IN NAME, EMAIL, PASSWORD AND PROFILE PICTURE IF EMAIL IS UNIQUE AND SEND WELCOME EMAIL
controller.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    // console.log(req.body)
    if (!name || !email || !password) {
      // 422 error: Server has understood the request but can not process it
      return res.status(422).json({ error: "Fields are missing" });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(422).json({
        error: "User already exits. Please register with another email.",
      });
    } else {
      try {
        const inputs = {
          name: name,
          email: email,
          password: hashedPassword,
          picture: picture,
        };

        await User.create(inputs);

        emailNewUser(inputs.email);
        // returns successful sign up message after sign up
        return res.status(200).json({ message: "User successfully created" });
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
});

// SIGN IN ROUTE - IF EMAIL EXISTS AND PASSWORD IS CORRECT, IT WILL ASSIGN THE USER A JWT TOKEN AND RETURN JWT TOKEN, ID, NAME, EMAIL, FOLLOWERS, FOLLOWING AND PROFILE PITCURE
controller.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "Fields are missing" });
    }

    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return res
        .status(401)
        .json({ error: "Invalid Email or Password. Please try again." });
    } else {
      const isCorrectPassword = bcrypt.compareSync(
        password,
        existingUser.password
      );

      if (!isCorrectPassword) {
        return res
          .status(401)
          .json({ error: "Invalid Email or Password. Please try again." });
      } else {
        // return res.json({message: "User logged in"})
        const token = jwt.sign({ _id: existingUser._id }, JWT_SECRET);
        const { _id, name, email, followers, following, picture } =
          existingUser;
        // returns JWT token after successful sign in
        return res.json({
          token,
          user: { _id, name, email, followers, following, picture },
        });
      }
    }
  } catch (e) {
    return res.status(400).json({
      name: e.name,
      message: e.message,
    });
  }
});

// RESET PASSWORD ROUTE - WILL ASSIGN A RESET TOKEN AND EXPIRY FOR TOKEN AND SEND AN EMAIL TO THE USER
controller.post("/auth/reset-password", async (req, res) => {
  // creating a token for the reset password
  crypto.randomBytes(32, async (err, buffer) => {
    if (err) {
      return res.json({ err });
    }
    // changing from hexcode to String for the token
    const token = buffer.toString("hex");

    try {
      const findResetPasswordUser = await User.findOneAndUpdate(
        { email: req.body.email },
        {
          resetToken: token,
          expireToken: Date.now() + 3600000,
        },
        {
          new: true,
          select: "-password",
        }
      );

      if (!findResetPasswordUser) {
        return res.status(422).json({ error: "Sorry, user does not exist." });
      } else {
        passwordReset(findResetPasswordUser.email, token);
        return res.json({ message: "Password reset email sent!" });
      }
    } catch (e) {
      return res.status(400).json({
        name: e.name,
        message: e.message,
      });
    }
  });
});
// NEW PASSWORD ROUTE - IF TOKEN IS VALID, WILL CHANGE PASSWORD FOR REQUESTING EMAIL TO NEW PASSWORD AND SET RESET TOKEN AND EXPIRY TO NULL
controller.post("/auth/new-password", async (req, res) => {
  try {
    const newPassword = req.body.password;
    /*If the reset link is valid, this should be the  
        same token as the one that was set when the user 
        made a request to reset their password */
    const sentToken = req.body.token;
    const newHashedPassword = bcrypt.hashSync(
      newPassword,
      bcrypt.genSaltSync(10)
    );

    const resetPasswordRequest = await User.findOneAndUpdate(
      {
        resetToken: sentToken,
        expireToken: {
          $gt: Date.now(),
        },
      },
      {
        password: newHashedPassword,
        resetToken: null,
        expireToken: null,
      },
      {
        new: true,
        select: "-password",
      }
    );

    if (!resetPasswordRequest) {
      return res
        .status(422)
        .json({ error: "Reset request has expired. Please try again." });
    } else {
      return res.json({ message: "Password updated successfully." });
    }
  } catch (e) {
    return res.status(400).json({
      name: e.name,
      message: e.message,
    });
  }
});

module.exports = controller;
