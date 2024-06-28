require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/auth");

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Routes
app.use("/auth", authRoutes);

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
