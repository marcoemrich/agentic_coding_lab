# Pixel Art Scaler Kata - Experiment Prompt

## Feature: Pixel Art Scaling

A pixel art editor needs to scale small pixel art images by integer factors. Unlike smooth image scaling, pixel art scaling must preserve the blocky, crisp appearance by replicating pixels exactly.

## Rules

1. **Image Representation**: Image is a 2D grid of single-character pixels (e.g., `#`, `.`, `@`)
2. **Scale Factor**: Integer >= 1 that determines how many times each pixel is replicated
3. **Horizontal Scaling**: Each pixel is repeated `scale` times horizontally
4. **Vertical Scaling**: Each row is repeated `scale` times vertically
5. **Empty Image**: Empty input returns empty output
6. **Scale 1**: Returns identical copy of input

## Examples

**Scale 1 (Identity)**:
```
Input:
#.
.#

Scale: 1

Output:
#.
.#
```

**Scale 2 (2x2 blocks)**:
```
Input:
#.
.#

Scale: 2

Output:
##..
##..
..##
..##
```

**Scale 3 (Single Row)**:
```
Input:
ABC

Scale: 3

Output:
AAABBBCCC
AAABBBCCC
AAABBBCCC
```

**Scale 2 (Single Column)**:
```
Input:
X
Y
Z

Scale: 2

Output:
XX
XX
YY
YY
ZZ
ZZ
```

**Scale 2 (Complex Pattern)**:
```
Input:
#.#
.#.
#.#

Scale: 2

Output:
##..##
##..##
..##..
..##..
##..##
##..##
```

**Empty Image**:
```
Input: (empty)
Scale: 3
Output: (empty)
```

**Single Pixel**:
```
Input:
@

Scale: 4

Output:
@@@@
@@@@
@@@@
@@@@
```

## Task

Implement the Pixel Art Scaler based on the rules and examples above.

Each string in the input/output array represents one row of pixels.

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
