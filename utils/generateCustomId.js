const { v4: uuidv4 } = require("uuid");

const generateCustomId = (prefix = "PR") => {
  // Generate a uuid
  const uuid = uuidv4();

  // Extract only the numbers from the uuid
  const numericPart = uuid.replace(/\D/g, "");

  // Take the first 6 digits from the numeric part (or any number of digits you prefer)
  const uniqueNumber = numericPart.slice(0, 6);

  // Combine the prefix and the unique number
  return `${prefix}${uniqueNumber}`;
};

module.exports = generateCustomId;
