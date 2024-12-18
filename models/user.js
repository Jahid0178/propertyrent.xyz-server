const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    authorId: String,
    fullName: String,
    userName: {
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
    avatar: {
      type: mongoose.Types.ObjectId,
      ref: "Asset",
      default: null,
    },
    role: String,
    credit: Number,
    package: { type: mongoose.Types.ObjectId, ref: "CreditPackage" },
    currentPlan: { type: mongoose.Types.ObjectId, ref: "Payout" },
    balance: Number,
    googleId: String,
    properties: [{ type: mongoose.Types.ObjectId, ref: "Property" }],
    unlockedProperties: [
      { type: mongoose.Types.ObjectId, ref: "Property", default: [] },
    ],
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
