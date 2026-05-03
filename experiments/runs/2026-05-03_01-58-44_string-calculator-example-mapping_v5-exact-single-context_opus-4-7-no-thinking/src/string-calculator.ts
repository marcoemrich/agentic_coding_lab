export const add = (input: string): number => {
  return input.split(",").reduce((sum, n) => sum + Number(n), 0);
};
