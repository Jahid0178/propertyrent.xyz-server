const paginatedResult = (option) => {
  const page = Number(option.page || 1);
  const limit = Number(option.limit || 12);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

module.exports = paginatedResult;
