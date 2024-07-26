const express = require("express");
const router = express.Router();
const {
  handlePayout,
  handleSuccessPayout,
  getPayoutByUserId,
} = require("../controllers/payout.controller");

router.post("/", handlePayout);
router.post("/success/:tranId/:userId/:packageId", handleSuccessPayout);
router.get("/get-payout/:userId", getPayoutByUserId);

module.exports = router;
