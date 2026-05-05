import parser from "@babel/parser";
import { createInterface } from "readline";
import { readdirSync, readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { next, prev, resetSession } from "./functions.js";
import { execute } from "./execute.js";
import { render } from "./render.js";
import { config, steps } from "./variables.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const testsDir = resolve(__dirname, "tests");
const files = readdirSync(testsDir).filter((f) => f.endsWith(".js"));

function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(question, (answer) => { rl.close(); res(answer); }));
}

function waitForKeypress() {
  return new Promise((res) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    function onKey(key) {
      if (key === "n") { next(); }
      else if (key === "p") { prev(); }
      else if (key === "\u0003") { process.exit(); } // Ctrl+C
      else if (key === "q") { process.exit(); }
      else if (key === "m") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener("data", onKey);
        res();
      }
    }

    process.stdin.on("data", onKey);
  });
}

async function runMenu() {
  resetSession();

  console.clear();
  console.log("Select a script to visualize:\n");
  files.forEach((f, i) => console.log(`  ${i + 1}. ${f.replace(".js", "")}`));

  const choice = await prompt("\nEnter number: ");
  const selected = files[parseInt(choice) - 1];

  if (!selected) {
    console.error("Invalid selection.");
    return runMenu();
  }

  config.code = readFileSync(resolve(testsDir, selected), "utf8");
  config.scriptName = selected.replace(".js", "");

  const ast = parser.parse(config.code, {
    sourceType: "module",
    locations: true,
  });

  ast.program.body.forEach(execute);

  console.clear();
  render(steps[0], 0);

  await waitForKeypress();

  runMenu();
}

runMenu();