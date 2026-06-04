const converToSlugHelpers = require("./convertToSlug");
module.exports.search = (find, query) => {
  const keyword = query.keyword;
  if (keyword) {
    const slugRegex = new RegExp(keyword, "i");
    const stringSlug = converToSlugHelpers.convertToSlug(keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i");
    find.$or = [{ title: slugRegex }, { slug: stringSlugRegex }];
  }
  return find;
};
