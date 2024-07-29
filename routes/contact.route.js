const express = require("express");
const router = express.Router();
const {
  createContactWithAdmin,
  createNotifyMe,
} = require("../controllers/contact.controller");

router.post("/with-admin", createContactWithAdmin);
router.post("/notify-me", createNotifyMe);

module.exports = router;
