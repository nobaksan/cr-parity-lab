// 어디서도 import·호출하지 않는 죽은 코드
function legacyEval(expr: string) {
  return eval(expr);
}
