const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new Schema (
    {
        name: { type: String, required: true},
        email: { type: String, required: true, unqiue: true},
        password: { type: String, required: true },
        picture: { type: String, default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"},
        followers: [{ type: ObjectId, ref:"User" }],
        following: [{ type: ObjectId, ref:"User" }],
        resetToken: { type: String },
        expireToken: { type: Date }

    },
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema);

module.exports = User;