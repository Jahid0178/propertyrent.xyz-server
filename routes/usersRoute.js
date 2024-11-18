const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUserById,
  uploadUserAvatar,
  getUserUnlockedProperty,
} = require("../controllers/users.controller");
const upload = require("../middleware/multer");

router.get("/", getAllUsers);
router.get("/unlocked-property", getUserUnlockedProperty);
router.get("/:id", getUserById);
router.put("/:id", updateUserById);
router.put("/:id/avatar", upload.array("avatar"), uploadUserAvatar);

module.exports = router;
