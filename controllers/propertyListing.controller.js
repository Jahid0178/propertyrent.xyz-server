const Property = require("../models/property.model");
const User = require("../models/user");
const createAsset = require("../services/asset.services");
const generateCustomId = require("../utils/generateCustomId");

const getAllPropertyListings = async (req, res) => {
  try {
    let queryOptions = {};

    if (req.query) {
      queryOptions = {
        ...(req.query.propertyType && { propertyType: req.query.propertyType }),
        ...(req.query.city && { "address.city": req.query.city }),
        ...(req.query.listingType && { listingType: req.query.listingType }),
        ...(req.query.minPrice && { price: { $gte: req.query.minPrice } }),
        ...(req.query.maxPrice && { price: { $lte: req.query.maxPrice } }),
      };
    }

    const properties = await Property.find(queryOptions)
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

    const user = await User.findById({ _id: authorId });

    const decreaseCredit = user.credit - 10;

    if (decreaseCredit <= 0) {
      return res.status(404).json({
        message: "You don't have enough credit.",
        status: 404,
      });
    }

    // Uploading property images
    const images = await createAsset(files);

    // Property unique id
    const puid = generateCustomId("PR");

    const modifyData = {
      puid,
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
        $set: { credit: decreaseCredit },
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

const getPropertyByLocation = async (req, res) => {
  try {
    const { city, upazilla } = req.params;

    const searchQuery = {
      "address.city": city,
      ...(upazilla && { "address.upazilla": upazilla }),
    };

    const queryProperty = await Property.find(searchQuery)
      .populate("images", "url")
      .sort({ createdAt: -1 });

    if (!queryProperty) {
      return res.status(404).json({
        message: "Query properties not found",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Property fetched successfully",
      status: 200,
      count: queryProperty.length,
      data: queryProperty,
    });
  } catch (error) {
    console.log("Property query error", error);
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
  getPropertyByLocation,
};
