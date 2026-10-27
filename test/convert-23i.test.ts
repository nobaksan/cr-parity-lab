import { convert } from "../src/convert-23i";

console.assert(convert("a b") === "A B");
console.assert(convert("") === "");
