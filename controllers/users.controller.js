const User = require("../models/user");

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
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User fetched successfully", status: 200, user });
  } catch (error) {}
};

module.exports = { getAllUsers, getUserById };