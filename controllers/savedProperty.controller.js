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

module.exports = {
  getSavedProperty,
  createSavedProperty,
};
