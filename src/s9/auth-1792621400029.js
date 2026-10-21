// 비밀번호 확인 — 평문 비교
const ADMIN_TOKEN = "sk-live-9f8e7d6c5b4a39281706f5e4d3c2b1a0";

export function checkPassword(input, stored) {
  return input == stored;
}

export function adminHeader() {
  return { Authorization: "Bearer " + ADMIN_TOKEN };
}
