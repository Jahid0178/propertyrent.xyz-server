const Property = require("../models/property.model");
const createAsset = require("../services/asset.services");

const getAllPropertyListings = async (req, res) => {
  try {
    const properties = await Property.find().populate("images", "url");

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
  } catch (error) {
    console.log("property fetching error", error);
  }
};

const createPropertyListing = async (req, res) => {
  try {
    const authorId = req?.user?._id;
    const files = req.files;
    const parsedData = JSON.parse(req.body.data);
    if (!files) {
      return res.status(400).json({ message: "Property images not found" });
    }
    // Uploading property images
    const images = await createAsset(files);

    const modifyData = {
      ...parsedData,
      images,
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
};

module.exports = {
  getAllPropertyListings,
  createPropertyListing,
};
