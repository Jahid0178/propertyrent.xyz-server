const express = require("express");
const router = express.Router();

const { getAllUsers, getUserById } = require("../controllers/users.controller");

router.get("/", getAllUsers);
router.get("/:id", getUserById);

module.exports = router;
