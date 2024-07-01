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
      type: [String],
    },
    price: {
      type: Number,
      required: true,
    },
    propertyDetails: {
      propertyFeatures: {
        propertySize: {
          type: Number,
          required: true,
        },
        propertySizeUnit: {
          type: String,
          required: true,
        },
        numberOfBedrooms: {
          type: Number,
          required: true,
        },
        numberOfBathrooms: {
          type: Number,
          required: true,
        },
        numberOfDiningrooms: {
          type: Number,
          required: true,
        },
        numberOfGarage: {
          type: Number,
          required: true,
        },
        numberOfBalconies: {
          type: Number,
          required: true,
        },
        renovation: {
          type: String,
          required: true,
        },
        yearBuilt: {
          type: Number,
          required: true,
        },
      },
      propertyUtilities: {
        gas: {
          type: Boolean,
          required: true,
        },
        electricity: {
          type: Boolean,
          required: true,
        },
        internet: {
          type: Boolean,
          required: true,
        },
        water: {
          type: Boolean,
          required: true,
        },
      },
      outdoorFeatures: {
        garden: {
          type: Boolean,
          required: true,
        },
        pool: {
          type: Boolean,
          required: true,
        },
        playground: {
          type: Boolean,
          required: true,
        },
        fencing: {
          type: Boolean,
          required: true,
        },
      },
      nearby: {
        school: {
          type: Boolean,
          required: true,
        },
        hospital: {
          type: Boolean,
          required: true,
        },
        shoppingCenter: {
          type: Boolean,
          required: true,
        },
        publicTransport: {
          type: Boolean,
          required: true,
        },
      },
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", PropertySchema);
module.exports = Property;
