function scaleHorizontally(line: string, factor: number): string {
  return line.split('').map(char => char.repeat(factor)).join('');
}

function scaleVertically(image: string[], factor: number): string[] {
  return image.flatMap(line => Array(factor).fill(line));
}

export function scale(image: string[], factor: number): string[] {
  if (image.length === 0) {
    return [];
  }
  const horizontallyScaled = image.map(line => scaleHorizontally(line, factor));
  return scaleVertically(horizontallyScaled, factor);
}
