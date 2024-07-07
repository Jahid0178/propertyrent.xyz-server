const SavedProperty = require("../models/savedProperty");

const getSavedProperty = async (req, res) => {
  try {
    res.json({
      message: "Get all saved property",
      status: 200,
    });
  } catch (error) {
    console.log("error from get saved property", error);
  }
};

const createSavedProperty = async (req, res) => {
  try {
    const data = {
      userId: req.body.data.userId,
      propertyId: req.body.data.propertyId,
    };

    const existingSavedProperty = await SavedProperty.findOne({
      userId: data.userId,
      propertyId: data.propertyId,
    });

    if (existingSavedProperty) {
      return res.json({
        message: "Property already saved",
        status: 409,
      });
    }

    const savedProperty = await SavedProperty.create(data);

    if (!savedProperty) {
      return res.json({
        message: "Failed to create saved property",
        status: 400,
      });
    }

    res.json({
      message: "Property saved successfully",
      status: 200,
      data: savedProperty,
    });
  } catch (error) {
    console.log("error from create saved property", error);
  }
};

const getSavedPropertyByUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const userSavedProperties = await SavedProperty.find({
      userId: userId,
    }).populate({
      path: "propertyId",
      select: "title images price propertyType listingType",
      populate: {
        path: "images",
        select: "url",
      },
    });

    if (!userSavedProperties) {
      return res.json({
        message: "No saved property found",
        status: 404,
      });
    }

    res.json({
      message: "Get saved property by user",
      status: 200,
      userSavedProperties,
    });
  } catch (error) {
    console.log("error from get saved property by user", error);
  }
};

const deleteSavedProperty = async (req, res) => {
  try {
    const savedPropertyId = req.params.id;
    const deletedSavedProperty = await SavedProperty.findByIdAndDelete({
      _id: savedPropertyId,
    });

    if (!deletedSavedProperty) {
      return res.json({
        message: "Failed to delete saved property",
        status: 400,
      });
    }

    res.json({
      message: "Saved property deleted successfully",
      status: 200,
    });
  } catch (error) {}
};

module.exports = {
  getSavedProperty,
  createSavedProperty,
  getSavedPropertyByUser,
  deleteSavedProperty,
};
