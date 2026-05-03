const scaleHorizontally = (line: string, scaleFactor: number): string =>
  line.split("").map((char) => char.repeat(scaleFactor)).join("");

const scaleHorizontalLines = (lines: string[], scaleFactor: number): string[] =>
  lines.map((line) => scaleHorizontally(line, scaleFactor));

const duplicateLines = (lines: string[], count: number): string[] =>
  lines.flatMap((line) => Array(count).fill(line));

export function scale(image: string[], scaleFactor: number): string[] {
  if (image.length === 0) {
    return [];
  }

  const cols = image[0].length;
  const isMultiRow = image.length > 1;
  const isMultiCol = cols > 1;

  if (isMultiRow && !isMultiCol) {
    // Single column: scale vertically only
    return duplicateLines(image, scaleFactor);
  }

  if (isMultiRow && isMultiCol) {
    // Multi-row, multi-column: scale both horizontally and vertically
    const horizontallyScaled = scaleHorizontalLines(image, scaleFactor);
    return duplicateLines(horizontallyScaled, scaleFactor);
  }

  // Single row or single pixel: scale horizontally only
  return scaleHorizontalLines(image, scaleFactor);
}
