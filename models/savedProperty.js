const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savedPropertySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const SavedProperty = mongoose.model("SavedProperty", savedPropertySchema);

module.exports = SavedProperty;
