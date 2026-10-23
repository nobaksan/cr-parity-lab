/** 문자열을 왼쪽에서 채운다. */
export function padLeft(value: string, width: number, fill = " "): string {
  if (fill.length === 0) throw new RangeError("fill must not be empty");
  return value.length >= width ? value : fill.repeat(Math.ceil((width - value.length) / fill.length)).slice(0, width - value.length) + value;
}
