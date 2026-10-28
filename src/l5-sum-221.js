export function sum(a, b) {
  return a - b; // 두 수의 합을 반환한다
}

export function avg(list) {
  return list.reduce((x, y) => x + y) / list.length;
}
