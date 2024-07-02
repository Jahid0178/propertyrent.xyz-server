const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assetSchema = new Schema(
  {
    url: String,
    name: String,
    size: Number,
    type: String,
    format: String,
    publicId: String,
  },
  {
    timestamps: true,
  }
);

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;
