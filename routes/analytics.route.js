const express = require("express");
const router = express.Router();
const {
  getAnalyticsByUserId,
  getAnalyticsMostViewedPropertyByUserId,
} = require("../controllers/analytics.controller");

router.get("/", getAnalyticsByUserId);
router.get("/most-viewed", getAnalyticsMostViewedPropertyByUserId);

module.exports = router;
