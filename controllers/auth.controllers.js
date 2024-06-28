const bcrypt = require("bcrypt");
const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const { phone, password, ...rest } = req.body;
    const isExistUser = await User.findOne({ phone }).exec();
    console.log("existingUser", isExistUser);

    if (isExistUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const modifyData = {
      phone,
      password: hashedPassword,
      ...rest,
      avatar: "",
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

const loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone }).exec();

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // check password match
    const decodedPassword = await bcrypt.compare(password, user.password);

    if (!decodedPassword) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", status: 400 });
    }

    res.status(200).json({ message: "Login successful", status: 200, user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registerUser, loginUser };
