const Property = require("../models/property.model");
const User = require("../models/user");
const createAsset = require("../services/asset.services");
const generateCustomId = require("../utils/generateCustomId");
const paginatedResult = require("../utils/paginatedResult");
const { UNLOCKED_LISTING_CREDIT } = require("../constant/constant");

const getAllPropertyListings = async (req, res) => {
  try {
    const option = {
      page: parseInt(req.query.page),
      limit: parseInt(req.query.limit),
    };
    const { page, limit, skip } = paginatedResult(option);

    const totalDocuments = await Property.countDocuments();

    let queryOptions = {};

    if (req.query) {
      queryOptions = {
        ...(req.query.propertyType && { propertyType: req.query.propertyType }),
        ...(req.query.city && { "address.city": req.query.city }),
        ...(req.query.listingType && { listingType: req.query.listingType }),
        ...(req.query.minPrice && { price: { $gte: req.query.minPrice } }),
        ...(req.query.maxPrice && { price: { $lte: req.query.maxPrice } }),
        ...(req.query.yearBuild && {
          "propertyDetails.propertyFeatures.yearBuilt": req.query.yearBuild,
        }),
        ...(req.query.numberOfBedrooms && {
          "propertyDetails.propertyFeatures.numberOfBedrooms":
            req.query.numberOfBedrooms,
        }),
        ...(req.query.numberOfBathrooms && {
          "propertyDetails.propertyFeatures.numberOfBathrooms":
            req.query.numberOfBathrooms,
        }),
      };
    }

    const properties = await Property.find(queryOptions, null, {
      skip,
      limit,
    })
      .populate("images", "url")
      .populate("author", "fullName avatar")
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
      meta: { page, limit, total: totalDocuments },
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
        select:
          "fullName email phone role avatar credit isEmailVerified isPhoneVerified isBanned package currentPlan",
        populate: {
          path: "avatar",
          select: "url",
        },
        populate: {
          path: "currentPlan",
          select: "status -_id",
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

    if (!req.user) {
      return res.json({
        message: "User not found",
        status: 404,
        property,
        isUnlocked: false,
      });
    }

    const user = await User.findById(req.user._id);

    if (property.author._id.toString() === user._id.toString()) {
      return res.status(403).json({
        message: "You cannot unlock your own property",
        status: 403,
        property,
        isUnlocked: true,
      });
    }

    const isUnlocked = user.unlockedProperties.includes(propertyId);

    res.status(200).json({
      message: "Property fetched successfully",
      status: 200,
      property,
      isUnlocked,
    });
  } catch (error) {
    console.log("property fetching error", error);
  }
};

const createPropertyListing = async (req, res) => {
  try {
    const authorId = req?.user?._id;
    const body = req.body;
    const { images, ...rest } = body;

    const user = await User.findById({ _id: authorId }).populate(
      "package",
      "packageTitle price currency packageType -_id"
    );

    // const { listingPrice, expiresAt, maxListings, visibility, isFeatured } =
    //   calculateListingDetails(user?.package?.packageType);

    // if (user?.properties?.length >= maxListings) {
    //   return res
    //     .status(400)
    //     .json({ message: "You have reached the maximum listings limit" });
    // }

    // Property unique id
    const puid = generateCustomId("PR");

    const modifyData = {
      puid,
      author: authorId,
      featuredType: "recent",
      status: "pending",
      ...rest,
    };

    const property = await Property.create(modifyData);
    if (!property) {
      res.status(400).json({ message: "Property not created" });
    }

    await property.save();

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

const uploadPropertyListingImages = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No property images provided" });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const images = await createAsset(files);

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        $push: {
          images,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedProperty) {
      return res.status(400).json({ message: "Property image not uploaded" });
    }

    res.status(200).json({
      message: "Property image uploaded successfully",
      status: 200,
      data: updatedProperty,
    });
  } catch (error) {
    console.error("property image uploading error", error);
    return res.status(500).json({
      message: "An error occurred while uploading property images",
      error: error.message,
    });
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
    const featuredProperties = await Property.find({ visibility: "top-spot" })
      .populate("images", "url")
      .limit(8)
      .sort({ createdAt: -1 });

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

// unlocked property
const unlockedProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById({ _id: id }).populate({
      path: "author",
      select: "fullName phone -_id",
    });

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
        status: 404,
      });
    }

    const user = await req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: 404,
      });
    }

    if (user.credit < UNLOCKED_LISTING_CREDIT) {
      return res.status(404).json({
        message: "Insufficient credit, Please buy more credits",
        status: 404,
      });
    }

    if (property.author.toString() === user._id.toString()) {
      return res.status(403).json({
        message: "You cannot unlock your own property",
        status: 403,
      });
    }

    user.credit -= UNLOCKED_LISTING_CREDIT;

    user.unlockedProperties.push(id);

    await user.save();

    res.json({
      message: "Property unlocked successfully",
      status: 200,
      isUnlocked: true,
    });
  } catch (error) {
    console.log("unlocked property error", error);
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
  uploadPropertyListingImages,
  unlockedProperty,
};
