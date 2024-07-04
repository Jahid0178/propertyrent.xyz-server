const User = require("../models/user");
const Property = require("../models/property.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      status: 200,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: "properties",
      populate: { path: "author", select: "fullName avatar" },
      populate: { path: "images", select: "url" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User fetched successfully", status: 200, user });
  } catch (error) {}
};

module.exports = { getAllUsers, getUserById };
