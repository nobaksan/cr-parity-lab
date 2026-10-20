// Line comment doc.
function line_doc(a) { return a; }

/* Block comment doc. */
function block_doc(a) { return a; }

function no_doc(a) { return a; }

export function exp_undoc(a) { return a; }

export { line_doc, block_doc, no_doc };
