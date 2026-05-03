export const add = (input: string): number => {
  if (input === "") return 0;
  return input.split(",")
    .map(numStr => parseInt(numStr))
    .reduce((sum, num) => sum + num, 0);
};
