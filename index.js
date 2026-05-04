const parser = require("@babel/parser");

const code = `
let x = 10;
let y = x + 3;
x = y + 1;
`;

const ast = parser.parse(code, {
  sourceType: "module",
});

const state = {
  variables: {},
};

const steps = [];

function evaluate(node) {
  switch (node.type) {
    case "NumericLiteral":
      return node.value;

    case "Identifier":
      return state.variables[node.name];

    case "BinaryExpression":
      const left = evaluate(node.left);
      const right = evaluate(node.right);

      if (node.operator === "+") {
        return left + right;
      }

      throw new Error("Unsupported operator");

    default:
      throw new Error("Unsupported node: " + node.type);
  }
}

function execute(node) {
  console.log("Executing:", node.type);

  switch (node.type) {
    case "VariableDeclaration":
      node.declarations.forEach((decl) => {
        const name = decl.id.name;
        const value = evaluate(decl.init);

        state.variables[name] = value;

        console.log(`Set ${name} = ${value}`);
      });

      recordStep(node); // ✅ only here
      break;

    case "ExpressionStatement":
      execute(node.expression);

      recordStep(node); // ✅ only AFTER inner execution
      break;

    case "AssignmentExpression":
      const name = node.left.name;
      const value = evaluate(node.right);

      state.variables[name] = value;

      console.log(`Updated ${name} = ${value}`);

      // ❌ REMOVE recordStep from here
      break;

    default:
      throw new Error("Unsupported execution node: " + node.type);
  }

  console.log("State now:", JSON.stringify(state.variables));
  console.log("------");
}

function recordStep(node) {
  steps.push({
    nodeType: node.type,
    variables: { ...state.variables },
  });
}

// Run program
ast.program.body.forEach(execute);
console.log("FINAL STEPS:");
console.log(JSON.stringify(steps, null, 2));