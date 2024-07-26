const mongoose = require("mongoose");
const SSLCommerzPayment = require("sslcommerz-lts");
const CreditPackage = require("../models/creditPackage.model");
const Payout = require("../models/payout.model");
const User = require("../models/user");

const store_id = process.env.SSL_STORE_ID;
const store_pass = process.env.SSL_STORE_PASSWORD;
const is_live = false;

// generate transaction id
const tranId = new mongoose.Types.ObjectId().toString();

const handlePayout = async (req, res) => {
  try {
    const bodyData = req.body;

    if (!bodyData) {
      return res.status(400).json({
        status: 400,
        message: "Missing required fields",
      });
    }

    const package = await CreditPackage.findById(bodyData.packageId);

    if (!package) {
      return res.status(404).json({
        status: 404,
        message: "Package not found",
      });
    }

    const initiateData = {
      total_amount: package.price,
      currency: bodyData.currency,
      tran_id: tranId, // use unique tran_id for each api call
      success_url: `http://localhost:4000/payout/success/${tranId}/${bodyData.userId}/${bodyData.packageId}`,
      fail_url: "http://localhost:3000/fail",
      cancel_url: "http://localhost:3000/cancel",
      ipn_url: "http://localhost:3000/ipn",
      shipping_method: "NO",
      product_name: package.packageTitle,
      product_category: "credit package",
      product_profile: "general",
      cus_name: bodyData.fullName,
      cus_email: bodyData.email,
      address: bodyData.address,
      cus_phone: bodyData.phone,
      cus_fax: bodyData.phone,
    };

    const sslcz = new SSLCommerzPayment(store_id, store_pass, is_live);
    const sslczResponse = await sslcz.init(initiateData);
    const gatewayPageURL = sslczResponse.GatewayPageURL;

    res.status(200).json({
      status: 200,
      message: "Payout initiated successfully",
      url: gatewayPageURL,
    });
  } catch (error) {
    console.log("error from purchase", error);
  }
};

const handleSuccessPayout = async (req, res) => {
  try {
    const { tranId, userId, packageId } = req.params;

    if (!tranId || !userId || !packageId) {
      return res.status(400).json({
        status: 400,
        message: "Missing required fields",
      });
    }

    await Payout.updateMany(
      { userId: userId, status: true },
      {
        $set: {
          status: false,
        },
      }
    );

    const package = await CreditPackage.findById(packageId);

    const payoutData = {
      tranId: tranId,
      userId: userId,
      packageId: packageId,
      amount: package.price,
      status: true,
    };

    const payoutResponse = await Payout.create(payoutData);

    if (!payoutResponse) {
      return res.status(404).json({
        status: 404,
        message: "Payout not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          credit: package.price,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.log("error from success payout", error);
  }
};

const getPayoutByUserId = async (req, res) => {
  try {
    const params = req.params;

    if (!params?.userId) {
      return res.status(400).json({
        status: 400,
        message: "Missing user id",
      });
    }

    const payouts = await Payout.find({ userId: params?.userId })
      .populate("packageId", "packageTitle")
      .sort({ createdAt: -1 });

    if (!payouts) {
      return res.status(404).json({
        status: 404,
        message: "Payout not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Payout fetched successfully",
      count: payouts.length,
      data: payouts,
    });
  } catch (error) {
    console.log("error from get payout by user id", error);
  }
};

module.exports = { handlePayout, handleSuccessPayout, getPayoutByUserId };
