function plain_decl(a) { return a; }

/** Documented declaration. */
function doc_decl(a) { return a; }

const arrow_fn = (a) => a + 1;

/** Documented arrow. */
const doc_arrow = (a) => a + 2;

class Box {
  /** Make a box. */
  constructor(v) { this.v = v; }

  get_value() { return this.v; }

  static of(v) { return new Box(v); }
}

function outer() {
  function inner() { return 1; }
  return [1, 2].map((x) => x + inner());
}

// Line comment doc.
function line_doc(a) { return a; }

/* Block comment doc. */
function block_doc(a) { return a; }

export { plain_decl, doc_decl, arrow_fn, doc_arrow, Box, outer, line_doc, block_doc };
