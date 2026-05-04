export const code = `
let x = 5;
let y = x + (x + (x + 1));
`;

export const state = {
  variables: {},
};

export const steps = [];
export const originalCode = code;
export const colors = {
  reset: "\x1b[0m",
  gray: "\x1b[90m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};