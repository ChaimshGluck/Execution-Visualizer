import { evaluate } from "./evaluate.js";
import { state } from "./variables.js";
import { recordStep } from "./functions.js";

export function execute(node) {
  switch (node.type) {
    case "VariableDeclaration":
      node.declarations.forEach((decl) => {
        const name = decl.id.name;
        const value = evaluate(decl.init);

        state.variables[name] = value;
      });

      recordStep(node);
      break;

    case "ExpressionStatement":
      execute(node.expression);

      recordStep(node);
      break;

    case "AssignmentExpression":
      const name = node.left.name;
      const value = evaluate(node.right);

      state.variables[name] = value;

      break;

    default:
      throw new Error("Unsupported execution node: " + node.type);
  }
}
