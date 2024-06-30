require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/auth");
const usersRoute = require("./routes/usersRoute");
require("./config/passport.config");
// Middlewares
app.use(
  cors({
    methods: "GET,HEAD,POST,PUT,PATCH,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// app.set("trust proxy", 1);
// Session configuration
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
    }),
    cookie: { secure: false, maxAge: 2592000000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users/me", (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: "User fetched successfully",
      status: 200,
      user: req.user,
    });
  } else {
    res.status(401).json({
      message: "Unauthorized",
      status: 401,
    });
  }
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
