const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  getAllPropertyListings,
  createPropertyListing,
  getPropertyById,
  getTrendingProperty,
  getFeaturedProperty,
  getRecentProperty,
} = require("../controllers/propertyListing.controller");

router.get("/", getAllPropertyListings);
router.post("/", upload.array("images"), createPropertyListing);
router.get("/trending", getTrendingProperty);
router.get("/featured", getFeaturedProperty);
router.get("/recent", getRecentProperty);
router.get("/:id", getPropertyById);

module.exports = router;
