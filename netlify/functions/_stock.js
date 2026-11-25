// Shared helpers. Stock is kept in Stripe: each product has a metadata field "stock".
// No "stock" field means unlimited (not tracked), which suits gift cards.
exports.readStock = (product) => {
  const v = product && product.metadata && product.metadata.stock;
  if (v === undefined || v === '') return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.max(0, n) : null;
};
