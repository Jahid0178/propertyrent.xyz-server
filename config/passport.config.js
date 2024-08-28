const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "phone",
      passwordField: "password",
    },
    async function (phone, password, done) {
      try {
        const foundUser = await User.findOne({ phone }).exec();

        if (!foundUser) {
          return done(null, false, { message: "User not registered" });
        }

        // Check if user is registered with Google
        if (!foundUser.password) {
          return done(null, false, {
            message: "User registered with Google. Please use Google login.",
          });
        }

        const passwordMatched = await bcrypt.compare(
          password,
          foundUser.password
        );

        if (passwordMatched) {
          return done(null, foundUser);
        } else {
          return done(null, false, { message: "Wrong password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  const userData = await User.findById(user._id)
    .populate("avatar", "url")
    .populate({
      path: "currentPlan",
      populate: {
        path: "packageId",
      },
    });
  done(null, userData);
});
