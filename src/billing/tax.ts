/** 지역별 부가세율(소수). 알 수 없는 지역은 기본 10%. */
const RATES: Record<string, number> = { KR: 0.1, JP: 0.1, DE: 0.19, US: 0 };

/** 금액(원 단위 정수)에 붙는 세금을 반올림해 돌려준다. */
export function taxFor(region: string, amount: number): number {
  const rate = RATES[region] ?? 0.1;
  return Math.round(amount * rate);
}
