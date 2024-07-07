const express = require("express");
const router = express.Router();
const {
  getSavedProperty,
  createSavedProperty,
  getSavedPropertyByUser,
} = require("../controllers/savedProperty.controller");

router.get("/", getSavedProperty);
router.get("/:id", getSavedPropertyByUser);
router.post("/", createSavedProperty);

module.exports = router;
