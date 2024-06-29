require("dotenv").config();
require("./config/passport.config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/auth");
const usersRoute = require("./routes/usersRoute");

// Middlewares
app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);
// Session configuration
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoute);

// Error route
app.use((req, res) => {
  res.status(404).json({
    message: "Bad request route not found",
    status: 404,
  });
});

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectDB();
