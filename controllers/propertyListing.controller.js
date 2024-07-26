const Property = require("../models/property.model");
const User = require("../models/user");
const createAsset = require("../services/asset.services");

const getAllPropertyListings = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("images", "url")
      .sort({ createdAt: -1 });

    if (!properties) {
      return res
        .status(404)
        .json({ message: "Properties not found", status: 404 });
    }

    res.status(200).json({
      message: "Properties fetched successfully",
      status: 200,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.log("property fetching error", error);
  }
};

const getPropertyById = async (req, res) => {
  try {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId)
      .populate("images", "url")
      .populate({
        path: "author",
        select: "fullName email phone role avatar credit",
        populate: {
          path: "avatar",
          select: "url",
        },
      });

    if (!property) {
      return res
        .status(404)
        .json({ message: "Property not found", status: 404 });
    }

    // Incrementing property views
    property.views++;

    await property.save();

    res.status(200).json({
      message: "Property fetched successfully",
      status: 200,
      property,
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
      featuredType: "recent",
      mapLocation: {
        coordinates: [parsedData.coordinates.lat, parsedData.coordinates.lng],
      },
    };

    const property = await Property.create(modifyData);
    if (!property) {
      res.status(400).json({ message: "Property not created" });
    }

    property.save();

    await User.updateOne(
      {
        _id: authorId,
      },
      {
        $push: { properties: property._id },
      }
    );

    res.status(201).json({
      message: "Property created successfully",
      status: 201,
      property,
    });
  } catch (error) {
    console.error("property creating error", error);
  }
};

const updatePropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const parsedData = JSON.parse(req.body.data);

    // Finding property
    const property = await Property.findById(id);

    if (!property) {
      return res.json({ message: "Property not found" });
    }

    const modifyData = {
      ...parsedData,
      mapLocation: {
        coordinates: [parsedData.coordinates.lat, parsedData.coordinates.lng],
      },
    };
    console.log("modifyData", modifyData);
    // Updating property
    const updatedProperty = await Property.findByIdAndUpdate(id, parsedData, {
      new: true,
    });

    if (!updatedProperty) {
      return res.json({ message: "Property not updated" });
    }

    res.status(200).json({
      message: "Property updated successfully",
      status: 200,
      property: updatedProperty,
    });
  } catch (error) {
    console.error("property updating error", error);
  }
};

const getTrendingProperty = async (req, res) => {
  try {
    const trendingProperty = await Property.find()
      .populate("images", "url")
      .sort({ views: -1 })
      .limit(8);

    if (!trendingProperty) {
      return res
        .status(404)
        .json({ message: "Trending property not found", status: 404 });
    }

    res.status(200).json({
      message: "Trending property fetched successfully",
      status: 200,
      count: trendingProperty.length,
      trendingProperty,
    });
  } catch (error) {
    console.log("trending property error", error);
  }
};

const getFeaturedProperty = async (req, res) => {
  try {
    const featuredProperties = await Property.find({ isFeatured: true })
      .populate("images", "url")
      .limit(8);

    if (!featuredProperties) {
      return res
        .status(404)
        .json({ message: "Featured property not found", status: 404 });
    }

    res.status(200).json({
      message: "Featured property fetched successfully",
      status: 200,
      count: featuredProperties.length,
      featuredProperties,
    });
  } catch (error) {
    console.log("featured property error", error);
  }
};

const getRecentProperty = async (req, res) => {
  try {
    const recentProperties = await Property.find()
      .populate("images", "url")
      .sort({ createdAt: -1 });

    if (!recentProperties) {
      return res
        .status(404)
        .json({ message: "Recent property not found", status: 404 });
    }

    res.status(200).json({
      message: "Recent property fetched successfully",
      status: 200,
      count: recentProperties.length,
      recentProperties,
    });
  } catch (error) {
    console.log("recent property error", error);
  }
};

module.exports = {
  getAllPropertyListings,
  createPropertyListing,
  updatePropertyById,
  getPropertyById,
  getTrendingProperty,
  getFeaturedProperty,
  getRecentProperty,
};
