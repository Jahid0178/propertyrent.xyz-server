const express = require("express");
const router = express.Router();
const {
  handlePayout,
  handleSuccessPayout,
} = require("../controllers/payout.controller");

router.post("/", handlePayout);
router.post("/success/:tranId/:userId/:packageId", handleSuccessPayout);

module.exports = router;
