const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const postSchema = new Schema(
  {
    // title: { type: String, required: true},
    caption: { type: String, required: true },
    image: { type: String, required: true },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        text: {
          type: String,
        },
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    postedBy: { type: ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
