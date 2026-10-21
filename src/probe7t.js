function fast_sum(items) {
  let total = 0;
  for (const item of items) {
    console.log("adding", item);
    total += item;
  }
  return total;
}

function make_tag(name) {
  return "tag:" + name;
}

export { fast_sum, make_tag };
