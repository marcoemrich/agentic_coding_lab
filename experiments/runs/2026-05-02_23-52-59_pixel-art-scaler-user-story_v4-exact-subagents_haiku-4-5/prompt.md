# Pixel Art Scaler Kata

## User Story

**As a** pixel artist
**I want** to enlarge my pixel art by an integer factor without losing its blocky look
**so that** I can present the same image at multiple sizes while keeping every pixel crisp.

## Acceptance Criteria

- The image is represented as a 2D grid of single-character pixels.
- The scale factor is a positive integer (>= 1).
- Each pixel is replicated exactly `scale` times horizontally.
- Each row is replicated exactly `scale` times vertically.
- A scale factor of 1 returns an unchanged copy of the input.
- An empty image returns an empty image, independent of the scale factor.
- Character values are preserved exactly; no smoothing, blending or interpolation is applied.

## Expected Output Files

- `src/pixel-art-scaler.ts` - Implementation
- `src/pixel-art-scaler.spec.ts` - Tests

## Constraints

- Use TypeScript
- Scale factor is always a positive integer (>= 1)
- All rows in input have the same length
- Pixels are single characters (any printable ASCII character)
- Preserve exact character values (no interpolation or blending)
