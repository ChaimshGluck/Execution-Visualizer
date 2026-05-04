import parser from "@babel/parser";
import readline from "readline";
import { next, prev } from "./functions.js";
import { execute } from "./execute.js";
import { render } from "./render.js";
import { code, steps } from "./variables.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  if (input === "n") next();
  if (input === "p") prev();
  if (input === "q") process.exit();
});

const ast = parser.parse(code, {
  sourceType: "module",
  locations: true,
});

// Run program
ast.program.body.forEach(execute);

console.log("Debugger ready. Type 'n' for next, 'p' for prev.");

render(steps[0], 0);