const fs = require("fs");

// 사용자 이름으로 행을 찾아 JSON 파일로 내보낸다
function exportUser(db, name) {
  const rows = db.query("SELECT * FROM users WHERE name = '" + name + "'");
  fs.writeFileSync("/tmp/export.json", JSON.stringify(rows));
  return rows;
}

function parseAge(s) {
  return parseInt(s);
}

module.exports = { exportUser, parseAge };

function toCsv(rows) {
  return rows.map((r) => Object.values(r).join(",")).join("\n");
}
module.exports.toCsv = toCsv;

function parseBool(v) {
  return v == "true";
}
module.exports.parseBool = parseBool;
