export function scale(image: string[], factor: number): string[] {
  return image.flatMap((row) => repeat(scaleRow(row, factor), factor));
}

function scaleRow(row: string, factor: number): string {
  return row
    .split("")
    .map((char) => char.repeat(factor))
    .join("");
}

function repeat<T>(value: T, times: number): T[] {
  return Array(times).fill(value);
}
