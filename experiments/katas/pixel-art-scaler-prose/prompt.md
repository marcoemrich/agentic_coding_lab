# Pixel Art Scaler Kata

## Feature

Pixel art is a style of digital image where every pixel is placed deliberately and the blocky look is part of the aesthetic. When such an image is enlarged it must not be smoothed or blended in the way photographs are scaled; instead, every pixel is replicated exactly. Our editor needs a function that takes a small pixel art image, represented as a 2D grid of single-character pixels, together with an integer scale factor of one or greater, and returns a larger image. Each pixel in the input is replicated `scale` times horizontally, and each row is replicated `scale` times vertically. A scale factor of one returns an exact copy of the input. An empty image always produces an empty output, regardless of scale. Character values are preserved verbatim — no interpolation, no anti-aliasing, no color blending.

## Task

Implement the scaling function so that pixel art remains crisp at any integer zoom level.

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
