export const add = (numbers: string): number =>
  numbers.split(",").reduce((sum, numberString) => sum + Number(numberString), 0);
