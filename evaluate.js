import { recordEval } from "./functions.js";
import { state } from "./variables.js";

export function evaluate(node) {
  switch (node.type) {
    case "NumericLiteral":
      recordEval(node, node.value);
      return node.value;

    case "Identifier":
      const val = state.variables[node.name];
      recordEval(node, val);
      return val;

    case "BinaryExpression":
      const left = evaluate(node.left);
      const right = evaluate(node.right);

      let result;

      if (node.operator === "+") {
        result = left + right;
      } else {
        throw new Error("Unsupported operator");
      }

      recordEval(node, result);
      return result;

    default:
      throw new Error("Unsupported node: " + node.type);
  }
}