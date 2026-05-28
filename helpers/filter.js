module.exports.filter = (query, products) => {
  if (query.brand) {
    const brands = Array.isArray(query.brand) ? query.brand : [query.brand];
    products = products.filter((product) => {
      return brands.includes(product.brandId);
    });
  }
  if (query.segment) {
    products = products.filter((product) => {
      return product.tags.includes(query.segment);
    });
  }
  if (query.price) {
    switch (query.price) {
      case "under5":
        products = products.filter((p) => p.priceNew <= 5000000);
        break;
      case "5to10":
        products = products.filter(
          (p) => p.priceNew > 5000000 && p.priceNew <= 10000000,
        );
        break;
      case "10to20":
        products = products.filter(
          (p) => p.priceNew > 10000000 && p.priceNew <= 20000000,
        );
        break;
      case "above20":
        products = products.filter((p) => p.priceNew > 20000000);
        break;
    }
  }
  return products;
};
