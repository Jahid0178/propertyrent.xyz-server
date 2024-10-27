const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertySchema = new mongoose.Schema(
  {
    puid: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
    },
    listingType: {
      type: String,
      required: true,
    },
    availableFor: {
      type: String,
    },
    availableFrom: {
      type: String,
      required: true,
    },
    bedroom: {
      type: String,
      required: true,
    },
    bathroom: {
      type: String,
      required: true,
    },
    balcony: {
      type: String,
    },
    floor: {
      type: String,
    },
    size: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    images: {
      type: [Schema.Types.ObjectId],
      ref: "Asset",
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    featuredType: {
      type: String,
      enum: ["listing", "trending", "recent"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    priceInformation: {
      price: {
        type: Number,
        required: true,
      },
      priceUnit: {
        type: String,
        enum: ["Monthly", "Weekly", "Daily"],
        default: "Monthly",
      },
    },
    locationInformation: {
      division: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      upazila: {
        type: String,
        required: true,
      },
      sectorNo: {
        type: String,
      },
      roadNo: {
        type: String,
      },
      houseNo: {
        type: String,
      },
      shortAddress: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
