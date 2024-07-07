const express = require("express");
const router = express.Router();
const {
  getSavedProperty,
  createSavedProperty,
} = require("../controllers/savedProperty.controller");

router.get("/", getSavedProperty);
router.post("/", createSavedProperty);

module.exports = router;
