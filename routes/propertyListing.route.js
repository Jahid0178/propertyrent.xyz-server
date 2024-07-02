const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  getAllPropertyListings,
  createPropertyListing,
} = require("../controllers/propertyListing.controller");

router.get("/", getAllPropertyListings);

router.post("/", upload.array("images"), createPropertyListing);

module.exports = router;
