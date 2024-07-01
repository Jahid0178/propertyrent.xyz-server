const express = require("express");
const router = express.Router();
const Property = require("../models/property.model");

router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();

    if (!properties) {
      return res
        .status(404)
        .json({ message: "Properties not found", status: 404 });
    }

    res.status(200).json({
      message: "Properties fetched successfully",
      status: 200,
      properties,
    });
  } catch (error) {}
});

router.post("/", async (req, res) => {
  try {
    const authorId = req?.user?._id;
    const modifyData = {
      ...req.body,
      author: authorId,
    };
    const property = await Property.create(modifyData);
    if (!property) {
      res.status(400).json({ message: "Property not created" });
    }

    property.save();
    res.status(201).json({
      message: "Property created successfully",
      status: 201,
      property,
    });
  } catch (error) {
    console.error("property creating error", error);
  }
});

module.exports = router;
