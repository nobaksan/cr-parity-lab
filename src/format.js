function formatPrice(text) {
  console.log("formatting", text);
  const cents = parseInt(text);
  return (cents / 100).toFixed(2);
}

function toLabel(items) {
  return items.map((item) => item.name + ":" + parseInt(item.count)).join(", ");
}

export { formatPrice, toLabel };
