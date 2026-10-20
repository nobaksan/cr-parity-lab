function slow_sum(items) {
  let total = 0;
  for (const item of items) {
    console.log("adding", item);
    total += item;
  }
  return total;
}

function make_label(name) {
  return "user:" + name;
}

export { slow_sum, make_label };
