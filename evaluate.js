import { recordEval, recordCall } from "./functions.js";
import { state } from "./variables.js";
import { execute, ReturnSignal } from "./execute.js";

export function evaluate(node) {
  switch (node.type) {
    case "NumericLiteral":
      recordEval(node, node.value);
      return node.value;

    case "BooleanLiteral":
      recordEval(node, node.value);
      return node.value;

    case "StringLiteral":
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

    case "CallExpression": {
      const fnName = node.callee.name;
      const fn = state.functions[fnName];
      if (!fn) throw new Error(`Undefined function: ${fnName}`);

      const args = node.arguments.map(evaluate);

      recordCall(node, args);

      // bind params into global variables (no scope yet)
      const prevValues = {};
      fn.params.forEach((param, i) => {
        prevValues[param.name] = state.variables[param.name];
        state.variables[param.name] = args[i];
      });

      let returnValue = undefined;
      try {
        fn.body.body.forEach(execute);
      } catch (signal) {
        if (signal instanceof ReturnSignal) {
          returnValue = signal.value;
        } else {
          throw signal;
        }
      }

      // restore previous values of param names
      fn.params.forEach((param) => {
        if (prevValues[param.name] === undefined) {
          delete state.variables[param.name];
        } else {
          state.variables[param.name] = prevValues[param.name];
        }
      });

      recordEval(node, returnValue);
      return returnValue;
    }

    default:
      throw new Error("Unsupported node: " + node.type);
  }
}
