const express = require("express");
const router = express.Router();
const {
  getSavedProperty,
  createSavedProperty,
  getSavedPropertyByUser,
  deleteSavedProperty,
} = require("../controllers/savedProperty.controller");

router.get("/", getSavedProperty);
router.post("/", createSavedProperty);
router.get("/:id", getSavedPropertyByUser);
router.delete("/:id", deleteSavedProperty);

module.exports = router;
