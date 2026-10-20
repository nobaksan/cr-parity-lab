// Line comment doc.
function line_doc(a) { return a; }

/* Block comment doc. */
function block_doc(a) { return a; }

/**
 * Returns the supplied value unchanged.
 * @param {*} a - The value to return.
 * @returns {*} The supplied value.
 */
function no_doc(a) { return a; }

/**
 * Returns the supplied value unchanged.
 * @param {*} a - The value to return.
 * @returns {*} The supplied value.
 */
export function exp_undoc(a) { return a; }

export { line_doc, block_doc, no_doc };
