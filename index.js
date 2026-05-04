const parser = require("@babel/parser");

const code = `
let x = 5;
let y = x + (x + (x + 1));
`;

const ast = parser.parse(code, {
  sourceType: "module",
  locations: true,
});

const state = {
  variables: {},
};

const steps = [];

function evaluate(node) {
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

      recordStep(node)
      break;

    case "ExpressionStatement":
      execute(node.expression);

      recordStep(node);
      break;

    case "AssignmentExpression":
      const name = node.left.name;
      const value = evaluate(node.right);

      state.variables[name] = value;

      console.log(`Updated ${name} = ${value}`);

      break;

    default:
      throw new Error("Unsupported execution node: " + node.type);
  }

  console.log("State now:", JSON.stringify(state.variables));
  console.log("------");
}

function recordEval(node, result) {
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

function recordStep(node) {
  steps.push({
    type: "statement",
    description: describeNode(node),
    loc: node.loc,
    variables: { ...state.variables },
  });
}

// Run program
ast.program.body.forEach(execute);
console.log("FINAL STEPS:");
console.log(JSON.stringify(steps, null, 2));
