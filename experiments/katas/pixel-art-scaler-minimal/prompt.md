# Pixel Art Scaler Kata

## Task

Implement a pixel art scaler that enlarges a 2D grid of single-character pixels by an integer factor while preserving the blocky look.

## Expected Output Files

- `src/pixel-art-scaler.ts` - Implementation
- `src/pixel-art-scaler.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Scale factor is always a positive integer (>= 1)
- All rows in input have the same length
- Pixels are single characters (any printable ASCII character)
- Preserve exact character values (no interpolation or blending)
