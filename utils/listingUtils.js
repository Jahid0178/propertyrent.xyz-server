const {
  BASIC_LISTING_PRICE,
  STANDARD_LISTING_PRICE,
  PREMIUM_LISTING_PRICE,
  BASIC_DURATION_DAYS,
  STANDARD_DURATION_DAYS,
  PREMIUM_DURATION_DAYS,
  BASIC_MAX_LISTINGS,
  STANDARD_MAX_LISTINGS,
  PREMIUM_MAX_LISTINGS,
  BASIC_VISIBILITY,
  STANDARD_VISIBILITY,
  PREMIUM_VISIBILITY,
} = require("../constant/constant");

const calculateListingDetails = (packageType) => {
  let listingPrice, durationDays, maxListings, visibility;

  switch (packageType) {
    case "basic":
      listingPrice = BASIC_LISTING_PRICE;
      durationDays = BASIC_DURATION_DAYS;
      maxListings = BASIC_MAX_LISTINGS;
      visibility = BASIC_VISIBILITY;
      break;
    case "standard":
      listingPrice = STANDARD_LISTING_PRICE;
      durationDays = STANDARD_DURATION_DAYS;
      maxListings = STANDARD_MAX_LISTINGS;
      visibility = STANDARD_VISIBILITY;
      break;
    case "premium":
      listingPrice = PREMIUM_LISTING_PRICE;
      durationDays = PREMIUM_DURATION_DAYS;
      maxListings = PREMIUM_MAX_LISTINGS;
      visibility = PREMIUM_VISIBILITY;
      break;
    default:
      throw new Error("Invalid listing type");
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  return { listingPrice, expiresAt, maxListings, visibility };
};

module.exports = { calculateListingDetails };
