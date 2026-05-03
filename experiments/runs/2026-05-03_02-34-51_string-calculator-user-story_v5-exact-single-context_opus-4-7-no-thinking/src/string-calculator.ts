export const add = (input: string): number => {
  return input.split(",").reduce((sum, numberStr) => sum + Number(numberStr), 0);
};
