const bcrypt = require("bcrypt");
const User = require("../models/user");
const passport = require("passport");

const registerUser = async (req, res) => {
  try {
    const { phone, password, userName, ...rest } = req.body;
    const isExistUser = await User.findOne({ phone }).exec();

    if (isExistUser) {
      return res
        .status(400)
        .json({ message: "User already exists", status: 400 });
    }

    const existingUserName = await User.findOne({ userName }).exec();

    if (existingUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const modifyData = {
      phone,
      password: hashedPassword,
      ...rest,
      avatar: null,
      userName,
      role: "user",
      credit: 0,
      balance: 0,
      isEmailVerified: false,
      isPhoneVerified: false,
      isBanned: false,
    };

    const user = new User(modifyData);
    await user.save();
    res
      .status(200)
      .json({ message: "User created successfully", status: 200, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const loginUser = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(400)
        .json({ message: info ? info.message : "Login failed", status: 400 });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json({ message: "Login successful", status: 200, user });
    });
  })(req, res, next);
};

const logoutUser = async (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      return res
        .status(200)
        .json({ status: 200, message: "Logout successful", user: null });
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred during logout" });
  }
};

module.exports = { registerUser, loginUser, logoutUser };
