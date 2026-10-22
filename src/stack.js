// 고정 용량 스택 — 가득 차면 push 가 거절되고 비면 pop 이 undefined 를 돌려준다.

export class BoundedStack {
  #items = [];
  #capacity;

  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity < 1) throw new RangeError("capacity must be a positive integer");
    this.#capacity = capacity;
  }

  /** 가득 차 있으면 false, 넣었으면 true. */
  push(value) {
    if (this.#items.length >= this.#capacity) return false;
    this.#items.push(value);
    return true;
  }

  pop() {
    return this.#items.pop();
  }

  peek() {
    return this.#items.at(-1);
  }

  get size() {
    return this.#items.length;
  }
}
