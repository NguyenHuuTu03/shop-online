module.exports.caculaterPriceNew = (product) => {
  product.priceNew = parseInt(
    (product.price * (1 - product.discount / 100)).toFixed(0),
  );
  return product;
};
