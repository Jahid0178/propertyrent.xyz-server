const User = require("../models/user");
const Property = require("../models/property.model");
const createAsset = require("../services/asset.services");

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
    const user = await User.findById(id)
      .populate({
        path: "properties",
        populate: { path: "author", select: "fullName avatar" },
        populate: { path: "images", select: "url" },
      })
      .populate("avatar", "url")
      .populate("package", "packageTitle price currency packageType -_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User fetched successfully", status: 200, user });
  } catch (error) {
    console.log("error from get user by id", error);
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(400).json({ message: "User not updated" });
    }

    res.status(200).json({
      message: "User updated successfully",
      status: 200,
      user: updatedUser,
    });
  } catch (error) {
    console.log("error from update user", error);
  }
};

const uploadUserAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files) {
      return res
        .status(400)
        .json({ message: "Avatar image not found", status: 400 });
    }

    const userAvatar = await createAsset(req.files);

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found", status: 404 });
    }

    await User.findByIdAndUpdate(
      id,
      {
        avatar: userAvatar[0],
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      message: "Avatar uploaded successfully",
      status: 200,
    });
  } catch (error) {
    console.log("error from upload user avatar", error);
  }
};

const getUserUnlockedProperty = async (req, res) => {
  try {
    const user = await req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    const unlockedProperties = await Property.find({
      _id: { $in: user.unlockedProperties },
    }).populate("images", "url");

    res.status(200).json({
      message: "Unlocked properties fetched successfully",
      status: 200,
      count: unlockedProperties.length,
      data: unlockedProperties,
    });
  } catch (error) {
    console.log("get user unlocked property error", error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  uploadUserAvatar,
  getUserUnlockedProperty,
};
