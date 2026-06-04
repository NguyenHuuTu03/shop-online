module.exports.pagination = async (objectPagination, query) => {
  objectPagination.currentPage = parseInt(query.page) || 1;
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem;

  return objectPagination;
};
