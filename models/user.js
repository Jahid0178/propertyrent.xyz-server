const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    authorId: String,
    fullName: String,
    username: {
      type: String,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: String,
    avatar: String,
    role: String,
    credit: Number,
    balance: Number,
    googleId: String,
    properties: [{ type: mongoose.Types.ObjectId, ref: "Property" }],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
