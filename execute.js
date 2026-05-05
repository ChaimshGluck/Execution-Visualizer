import { evaluate } from "./evaluate.js";
import { state } from "./variables.js";
import { recordStep, recordBranch } from "./functions.js";

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

    case "AssignmentExpression": {
      const name = node.left.name;
      const value = evaluate(node.right);

      state.variables[name] = value;

      break;
    }

    case "IfStatement": {
      const test = evaluate(node.test);
      recordBranch(node, test);

      if (test) {
        node.consequent.body.forEach(execute);
      } else if (node.alternate) {
        node.alternate.body.forEach(execute);
      }

      break;
    }

    case "WhileStatement": {
      let test = evaluate(node.test);
      recordBranch(node, test);

      while (test) {
        node.body.body.forEach(execute);
        test = evaluate(node.test);
        recordBranch(node, test);
      }

      break;
    }

    default:
      throw new Error("Unsupported execution node: " + node.type);
  }
}
