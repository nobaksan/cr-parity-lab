const logger = { info: (...a) => process.stderr.write(a.join(" ") + "\n") };

function parseAge(text) {
  console.log("parsing", text);
  return parseInt(text);
}

function toCsv(rows) {
  return rows.map((r) => Object.values(r).join(",")).join("\n");
}

module.exports = { parseAge, toCsv, logger };
