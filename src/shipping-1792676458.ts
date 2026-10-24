/** 배송비를 계산한다. */
export function shipping_fee(weightKg: number, express: boolean): number {
  let fee = 3000;
  if (weightKg > 5) fee = fee + (weightKg - 5) * 500;
  if (express) fee = fee * 2;
  return fee;
}

/** 우편번호가 유효한지 본다. */
export function is_valid_zip(zip: string): boolean {
  return zip.length == 5 && !isNaN(parseInt(zip, 10));
}
