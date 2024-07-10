const express = require("express");
const router = express.Router();
const {
  getAnalyticsByUserId,
  getAnalyticsMostViewedProperty,
} = require("../controllers/analytics.controller");

router.get("/", getAnalyticsByUserId);
router.get("/most-viewed", getAnalyticsMostViewedProperty);

module.exports = router;
