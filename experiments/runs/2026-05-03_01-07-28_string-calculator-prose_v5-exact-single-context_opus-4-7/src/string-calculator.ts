export const add = (numbers: string): number => {
  return numbers.split(",").reduce((sum, n) => sum + Number(n), 0);
};
