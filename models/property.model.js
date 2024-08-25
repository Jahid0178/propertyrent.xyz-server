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
    currency: {
      type: String,
      required: true,
    },
    availableFrom: {
      type: Date,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["standard", "enhanced", "top-spot"],
      default: "standard",
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      upazilla: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    images: {
      type: [Schema.Types.ObjectId],
      ref: "Asset",
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    propertyDetails: {
      propertyFeatures: {
        propertySize: {
          type: String,
          required: true,
        },
        propertySizeUnit: {
          type: String,
          required: true,
        },
        numberOfBedrooms: {
          type: String,
          required: true,
        },
        numberOfBathrooms: {
          type: String,
          required: true,
        },
        numberOfDiningrooms: {
          type: String,
        },
        numberOfGarage: {
          type: String,
        },
        numberOfBalconies: {
          type: String,
        },
        renovation: {
          type: String,
          required: true,
        },
        yearBuilt: {
          type: String,
          required: true,
        },
      },
      propertyUtilities: {
        gas: {
          type: String,
          required: true,
        },
        electricity: {
          type: String,
          required: true,
        },
        internet: {
          type: String,
          required: true,
        },
        water: {
          type: String,
          required: true,
        },
      },
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
    mapLocation: {
      coordinates: [Number],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
