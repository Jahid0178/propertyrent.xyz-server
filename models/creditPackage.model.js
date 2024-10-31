const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditPackageSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    credit: {
      type: Number,
      required: true,
    },
    bonusCredits: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CreditPackage = mongoose.model("CreditPackage", creditPackageSchema);

module.exports = CreditPackage;
