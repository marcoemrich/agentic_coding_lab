export function scalePixelArt(image: string[], scaleFactor: number): string[] {
  const horizontallyScaled = image.map((originalRow) =>
    originalRow.split("").map((pixel) => pixel.repeat(scaleFactor)).join("")
  );
  return horizontallyScaled.flatMap((scaledRow) => Array(scaleFactor).fill(scaledRow));
}
