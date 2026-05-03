export const add = (input: string): number => {
  if (input === "") return 0;
  return input.split(",").reduce((sum, n) => sum + parseInt(n), 0);
};
