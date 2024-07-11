const Property = require("../models/property.model");

const getAnalyticsByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    const properties = await Property.find({ author: userId });

    const totalPropertyViews = properties.reduce((total, property) => {
      return total + property.views;
    }, 0);

    if (!properties) {
      return res
        .status(404)
        .json({ message: "Properties not found", status: 404 });
    }

    res.status(200).json({
      message: "Properties fetched successfully",
      status: 200,
      count: properties.length,
      data: {
        properties,
        totalPropertyViews,
      },
    });
  } catch (error) {
    console.log("property fetching analytics error", error);
  }
};

const getAnalyticsMostViewedPropertyByUserId = async (req, res) => {
  try {
    const userId = req.user._id;

    const mostViewdProperty = await Property.find({ author: userId })
      .populate("images", "url")
      .sort({ views: -1 });

    if (!mostViewdProperty) {
      return res.json({
        message: "Most viewed property not found",
        status: 404,
      });
    }

    res.json({
      message: "Most viewed property fetched successfully",
      status: 200,
      count: mostViewdProperty.length,
      data: mostViewdProperty,
    });
  } catch (error) {
    console.log("error from most viewed route", error);
  }
};

module.exports = {
  getAnalyticsByUserId,
  getAnalyticsMostViewedPropertyByUserId,
};
