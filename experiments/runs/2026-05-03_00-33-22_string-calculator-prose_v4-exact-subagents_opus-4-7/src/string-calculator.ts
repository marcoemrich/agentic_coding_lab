export const add = (numbers: string): number =>
  numbers.split(",").reduce((sum, numberStr) => sum + Number(numberStr), 0);
