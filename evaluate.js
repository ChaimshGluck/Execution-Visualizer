import { recordEval } from "./functions.js";
import { state } from "./variables.js";

export function evaluate(node) {
  switch (node.type) {
    case "NumericLiteral":
      recordEval(node, node.value);
      return node.value;

    case "BooleanLiteral":
      recordEval(node, node.value);
      return node.value;

    case "Identifier":
      const val = state.variables[node.name];
      recordEval(node, val);
      return val;

    case "BinaryExpression": {
      const left = evaluate(node.left);
      const right = evaluate(node.right);

      let result;

      switch (node.operator) {
        case "+":
          result = left + right;
          break;
        case "-":
          result = left - right;
          break;
        case "*":
          result = left * right;
          break;
        case "/":
          result = left / right;
          break;
        case "%":
          result = left % right;
          break;
        case "**":
          result = left ** right;
          break;
        case "==":
          result = left == right;
          break;
        case "===":
          result = left === right;
          break;
        case "!=":
          result = left != right;
          break;
        case "!==":
          result = left !== right;
          break;
        case "<":
          result = left < right;
          break;
        case "<=":
          result = left <= right;
          break;
        case ">":
          result = left > right;
          break;
        case ">=":
          result = left >= right;
          break;
        case "&&":
          result = left && right;
          break;
        case "||":
          result = left || right;
          break;
        default:
          throw new Error("Unsupported operator: " + node.operator);
      }

      recordEval(node, result);
      return result;
    }

    case "UnaryExpression": {
      if (node.operator !== "!") {
        throw new Error("Unsupported unary operator: " + node.operator);
      }
      const val = evaluate(node.argument);
      const result = !val;
      recordEval(node, result);
      return result;
    }

    default:
      throw new Error("Unsupported node: " + node.type);
  }
}
