const calculateListingDetails = (packageType) => {
  let listingPrice, durationDays, maxListings;

  switch (packageType) {
    case "basic":
      listingPrice = 300;
      durationDays = 1;
      maxListings = 1;
      break;
    case "standard":
      listingPrice = 600;
      durationDays = 2;
      maxListings = 3;
      break;
    case "premium":
      listingPrice = 1200;
      durationDays = 3;
      maxListings = Infinity;
      break;
    default:
      throw new Error("Invalid listing type");
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + durationDays);

  return { listingPrice, expiresAt, maxListings };
};

module.exports = { calculateListingDetails };
