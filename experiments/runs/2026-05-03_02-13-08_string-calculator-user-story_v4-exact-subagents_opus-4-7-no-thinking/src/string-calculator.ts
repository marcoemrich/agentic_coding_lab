export const add = (numbers: string): number =>
  numbers.split(",").reduce((sum, numStr) => sum + Number(numStr), 0);
