const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PayoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    packageId: {
      type: Schema.Types.ObjectId,
      ref: "CreditPackage",
    },
    tranId: {
      type: Schema.Types.ObjectId,
    },
    amount: {
      type: Number,
    },
    status: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const Payout = mongoose.model("Payout", PayoutSchema);

module.exports = Payout;
