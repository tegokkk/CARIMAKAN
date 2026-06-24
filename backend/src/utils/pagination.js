const getPagination = (page, limit) => {
  const defaultPage = 1;
  const defaultLimit = 12;

  const parsedPage = parseInt(page, 10) || defaultPage;
  const parsedLimit = parseInt(limit, 10) || defaultLimit;

  const offset = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    offset
  };
};

const getPaginationData = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    totalPages,
    currentPage: page,
    limit
  };
};

module.exports = {
  getPagination,
  getPaginationData
};
