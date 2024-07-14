const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const creditPackageSchema = new Schema(
  {
    packageTitle: String,
    creditTitle: String,
    price: Number,
    currency: String,
    features: [String],
    description: String,
    packageCode: String,
  },
  {
    timestamps: true,
  }
);

const CreditPackage = mongoose.model("CreditPackage", creditPackageSchema);

module.exports = CreditPackage;
