const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

passport.use(
  new LocalStrategy(
    { usernameField: "phone", passwordField: "password" },
    async (phone, password, done) => {
      try {
        const user = await User.findOne({ phone }).exec();
        const decodedPassword = await bcrypt.compare(password, user.password);
        if (!user || !decodedPassword) {
          return done(null, false, { message: "Invalid credentials" });
        }

        if (decodedPassword) {
          return done(null, user);
        }
      } catch (error) {
        console.log("passport error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  const userData = await User.findById(user._id).exec();
  done(null, userData);
});

module.exports = passport;
