const express = require("express");
const router = express.Router();
const {
  getAnalyticsByUserId,
  getAnalyticsMostViewedPropertyByUserId,
  getChartAnalyticsByUserId,
} = require("../controllers/analytics.controller");

router.get("/", getAnalyticsByUserId);
router.get("/most-viewed", getAnalyticsMostViewedPropertyByUserId);
router.get("/chart-analytics", getChartAnalyticsByUserId);

module.exports = router;
