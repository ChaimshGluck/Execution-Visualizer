import { config, colors, steps, state } from "./variables.js";
import { render } from "./render.js";

let currentStep = 0;

export function recordEval(node, result) {
  steps.push({
    type: "eval",
    description: describeNode(node),
    result,
    loc: node.loc,
    variables: { ...state.variables },
  });
}

function describeNode(node) {
  switch (node.type) {
    case "NumericLiteral":
      return `${node.value}`;

    case "Identifier":
      return node.name;

    case "BinaryExpression":
      return `(${describeNode(node.left)} ${node.operator} ${describeNode(node.right)})`;

    case "VariableDeclaration":
      return node.declarations
        .map((decl) => `${decl.id.name} = ${describeNode(decl.init)}`)
        .join(", ");

    case "AssignmentExpression":
      return `${node.left.name} = ${describeNode(node.right)}`;

    default:
      return node.type;
  }
}

export function recordStep(node) {
  steps.push({
    type: "statement",
    description: describeNode(node),
    loc: node.loc,
    variables: { ...state.variables },
  });
}

export function next() {
  if (currentStep < steps.length - 1) {
    currentStep++;
    render(steps[currentStep], currentStep);
  } else {
    render(steps[currentStep], currentStep, "Already at last step.");
  }
}

export function prev() {
  if (currentStep > 0) {
    currentStep--;
    render(steps[currentStep], currentStep);
  } else {
    render(steps[currentStep], currentStep, "Already at first step.");
  }
}

export function resetSession() {
  currentStep = 0;
  steps.length = 0;
  Object.keys(state.variables).forEach((k) => delete state.variables[k]);
}

export function highlightCode(start, end) {
  const before = config.code.slice(0, start);
  const match = config.code.slice(start, end);
  const after = config.code.slice(end);

  return (
    colors.gray + before +
    colors.green + colors.bold + match +
    colors.gray + after +
    colors.reset
  );
}