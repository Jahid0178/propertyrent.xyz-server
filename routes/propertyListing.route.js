const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  getAllPropertyListings,
  createPropertyListing,
  updatePropertyById,
  getPropertyById,
  getTrendingProperty,
  getFeaturedProperty,
  getRecentProperty,
  getPropertyByLocation,
  uploadPropertyListingImages,
  unlockedProperty,
} = require("../controllers/propertyListing.controller");

router.get("/", getAllPropertyListings);
router.post("/", createPropertyListing);
router.put("/:id/images", upload.array("images"), uploadPropertyListingImages);
router.put("/:id", upload.array("images"), updatePropertyById);
router.get("/trending", getTrendingProperty);
router.get("/featured", getFeaturedProperty);
router.get("/recent", getRecentProperty);
router.get("/search/:city/:upazilla?", getPropertyByLocation);
router.get("/:id", getPropertyById);
router.post("/:id/unlock", unlockedProperty);

module.exports = router;
