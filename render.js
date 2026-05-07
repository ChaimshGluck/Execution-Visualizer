import { config, colors, steps } from "./variables.js";
import { highlightCode } from "./functions.js";

function displayValue(val) {
  if (typeof val === "string") return `"${val}"`;
  return String(val);
}

export function render(step, index, message = "") {
  process.stdout.write("\x1b[2J\x1b[3J\x1b[H");

  console.log("\n" + colors.bold + "Code:" + colors.reset);

  if (step.loc) {
    console.log(highlightCode(step.loc.start.index, step.loc.end.index));
  } else {
    console.log(config.code);
  }

  console.log(colors.gray + "------------------" + colors.reset);

  if (step.type === "eval") {
    console.log(
      colors.yellow +
      `EVAL:` +
      colors.reset +
      ` ${step.description} → ${displayValue(step.result)}`
    );
  } else if (step.type === "branch") {
    console.log(
      colors.cyan +
      `BRANCH:` +
      colors.reset +
      ` ${step.description}`
    );
  } else {
    console.log(
      colors.yellow +
      `STATEMENT:` +
      colors.reset +
      ` ${step.description}`
    );
  }

  console.log("\n" + colors.bold + "Variables:" + colors.reset);
  console.log(step.variables);

  console.log(
    "\n" +
    colors.cyan +
    `Step ${index + 1} / ${steps.length}` +
    colors.gray +
    `  —  ${config.scriptName}` +
    colors.reset
  );

  console.log(colors.gray + "[n] next  [p] prev  [m] menu  [q] quit" + colors.reset);

  if (message) {
    console.log(colors.yellow + message + colors.reset);
  }
}
