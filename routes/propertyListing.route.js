const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  getAllPropertyListings,
  createPropertyListing,
  getPropertyById,
} = require("../controllers/propertyListing.controller");

router.get("/", getAllPropertyListings);
router.post("/", upload.array("images"), createPropertyListing);
router.get("/:id", getPropertyById);

module.exports = router;
