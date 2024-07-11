const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PropertySchema = new mongoose.Schema(
  {
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
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
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
          required: true,
        },
        numberOfGarage: {
          type: String,
          required: true,
        },
        numberOfBalconies: {
          type: String,
          required: true,
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
      outdoorFeatures: {
        garden: {
          type: String,
          required: true,
        },
        pool: {
          type: String,
          required: true,
        },
        playground: {
          type: String,
          required: true,
        },
        fencing: {
          type: String,
          required: true,
        },
      },
      nearby: {
        school: {
          type: String,
          required: true,
        },
        hospital: {
          type: String,
          required: true,
        },
        shoppingCenter: {
          type: String,
          required: true,
        },
        publicTransport: {
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
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
