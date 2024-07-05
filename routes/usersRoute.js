const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserById,
} = require("../controllers/users.controller");

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);

module.exports = router;
