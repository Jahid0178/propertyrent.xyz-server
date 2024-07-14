const express = require("express");
const router = express.Router();
const {
  getAllCreditPackages,
  createCreditPackage,
  getCreditPackageById,
} = require("../controllers/creditPackage.controller");

router.get("/", getAllCreditPackages);
router.post("/", createCreditPackage);
router.get("/:id", getCreditPackageById);

module.exports = router;
