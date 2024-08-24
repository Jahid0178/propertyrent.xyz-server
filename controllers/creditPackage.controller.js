const CreditPackage = require("../models/creditPackage.model");

const getAllCreditPackages = async (req, res) => {
  try {
    const allCreditPackages = await CreditPackage.find();

    if (!allCreditPackages) {
      return res.json({
        message: "No credit packages found",
        status: 404,
      });
    }

    res.json({
      message: "Get all credit packages",
      status: 200,
      count: allCreditPackages.length,
      creditPackages: allCreditPackages,
    });
  } catch (error) {
    console.log("error from get all credit packages", error);
  }
};

const createCreditPackage = async (req, res) => {
  try {
    const data = req.body;

    const createdCreditPackage = await CreditPackage.create(data);

    if (!createdCreditPackage) {
      return res.json({
        message: "Failed to create credit package",
        status: 400,
      });
    }

    await createdCreditPackage.save();

    res.json({
      message: "Credit package created successfully",
      status: 200,
      creditPackage: createdCreditPackage,
    });
  } catch (error) {
    console.log("error from create credit package", error);
  }
};

const getCreditPackageById = async (req, res) => {
  try {
    const { id } = req.params;

    const creditPackage = await CreditPackage.findById(id);

    if (!creditPackage) {
      return res.json({
        message: "No credit package found",
        status: 404,
      });
    }

    res.json({
      message: "Get credit package",
      status: 200,
      creditPackage,
    });
  } catch (error) {
    console.log("error from get credit package by id", error);
  }
};

module.exports = {
  getAllCreditPackages,
  createCreditPackage,
  getCreditPackageById,
};
