require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;

// Passport setup for token verification
const passport = require("passport");
const strategy = require("./passport");

passport.use(strategy);

const { MONGO_URI } = require("./config/keys");
const app = express();

// Required Controllers
const authController = require("./controllers/authController");
const postController = require("./controllers/postController");
const profileController = require("./controllers/profileController");

// DB Connection methods
const dbConnection = mongoose.connection;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
dbConnection.on("connected", () =>
  console.log("Database Connected Successfully")
);
dbConnection.on("error", (err) => console.log(`Got error! ${err.message}`));
dbConnection.on("disconnected", () =>
  console.log("My database is disconnected")
);

require("./models/user");
require("./models/post");

// Additional middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Linking to the controllers
app.use("/api", authController);
app.use("/api", postController);
app.use("/api", profileController);

// Check environment
if (process.env.NODE_ENV === "production") {
  // need to serve the static files that are in the build folder when running on heroku
  app.use(express.static("client/build"));
  const path = require("path");
  // if the client makes ANY request, we will send the index.html file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
