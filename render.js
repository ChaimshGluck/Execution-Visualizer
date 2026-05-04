import { originalCode, colors, steps } from "./variables.js";
import { highlightCode } from "./functions.js";

export function render(step, index) {
  console.clear();

  console.log(
    colors.cyan +
    `Step ${index + 1} / ${steps.length}` +
    colors.reset
  );

  console.log(colors.gray + "------------------" + colors.reset);

  if (step.type === "eval") {
    console.log(
      colors.yellow +
      `EVAL:` +
      colors.reset +
      ` ${step.description} → ${step.result}`
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

  console.log("\n" + colors.bold + "Code:" + colors.reset);

  if (step.loc) {
    console.log(highlightCode(step.loc.start.index, step.loc.end.index));
  } else {
    console.log(originalCode);
  }
}
