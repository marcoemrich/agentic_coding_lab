export const scalePixelArt = (image: string, scale: number): string => {
  if (image === "") return "";
  return image
    .split("\n")
    .map((row) => [...row].map((char) => char.repeat(scale)).join(""))
    .flatMap((scaledRow) => Array(scale).fill(scaledRow))
    .join("\n");
};
