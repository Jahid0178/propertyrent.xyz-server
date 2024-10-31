const mongoose = require("mongoose");
const SSLCommerzPayment = require("sslcommerz-lts");
const CreditPackage = require("../models/creditPackage.model");
const Payout = require("../models/payout.model");
const User = require("../models/user");
const cron = require("node-cron");
const { calculateListingDetails } = require("../utils/listingUtils");

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

    const user = req.user;

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const userAddress = `${user.address.street}, ${user.address.city}, ${user.address.country}`;

    const initiateData = {
      total_amount: package.price,
      currency: "BDT",
      tran_id: tranId, // use unique tran_id for each api call
      success_url: `${process.env.BACKEND_URL}/redirect-to?url=${process.env.CLIENT_URL}/dashboard/buy-credit/success/${tranId}/${user._id}/${bodyData.packageId}`,
      fail_url: `${process.env.BACKEND_URL}/redirect-to?url=${process.env.CLIENT_URL}/fail`,
      cancel_url: `${process.env.BACKEND_URL}/redirect-to?url=${process.env.CLIENT_URL}/cancel`,
      ipn_url: `${process.env.BACKEND_URL}/redirect-to?url=${process.env.CLIENT_URL}/ipn`,
      shipping_method: "NO",
      product_name: package.name,
      product_category: "credit package",
      product_profile: "general",
      cus_name: user.fullName,
      cus_email: user.email,
      address: userAddress,
      cus_phone: user.phone,
      cus_fax: user.phone,
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
      { userId, status: "active" },
      {
        $set: {
          status: "deactive",
        },
      }
    );

    const package = await CreditPackage.findById(packageId);
    // const { expiresAt } = calculateListingDetails(package.packageType);

    const payoutData = {
      tranId,
      userId,
      packageId,
      amount: package.price,
      status: "active",
    };

    const payoutResponse = await Payout.create(payoutData);

    if (!payoutResponse) {
      return res.status(404).json({
        status: 404,
        message: "Payout creation failed",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          credit: package.price,
          package: package._id,
          currentPlan: payoutResponse._id,
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

    res.status(200).json({
      status: 200,
      message: "Payment success",
      data: payoutResponse,
    });
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
      .populate({
        path: "packageId",
        select: "name -_id",
      })
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

// Deactive user payouts when they are expired
// cron.schedule("0 0 * * *", async () => {
//   try {
//     const now = new Date();
//     await Payout.updateMany(
//       {
//         expiresAt: { $lt: now },
//         status: true,
//       },
//       {
//         $set: {
//           status: false,
//         },
//       }
//     );
//   } catch (error) {
//     console.log("payout error", error);
//   }
// });

module.exports = { handlePayout, handleSuccessPayout, getPayoutByUserId };
