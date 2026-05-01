# Mars Rover Kata

## Feature: Mars Rover Navigation

A squad of robotic rovers are to be landed by NASA on a plateau on Mars. A rover's position is represented by coordinates (x, y) and a direction (N, S, E, W). The plateau is a grid where rovers can move.

## Rules

1. **Position**: Rover has x, y coordinates and a direction (N, E, S, W)
2. **Turning Left (L)**: Changes direction counterclockwise (N→W→S→E→N)
3. **Turning Right (R)**: Changes direction clockwise (N→E→S→E→N)
4. **Moving Forward (F)**: Moves one unit in the current direction
   - N: y increases by 1
   - E: x increases by 1
   - S: y decreases by 1
   - W: x decreases by 1
5. **Commands**: String of commands executed sequentially (e.g., "FFRFLF")

## Examples

**Turn Left**:
```
Initial: (0, 0, N)
Command: "L"
Result: (0, 0, W)
```

**Turn Right**:
```
Initial: (0, 0, N)
Command: "R"
Result: (0, 0, E)
```

**Move Forward (North)**:
```
Initial: (0, 0, N)
Command: "F"
Result: (0, 1, N)
```

**Move Forward (East)**:
```
Initial: (0, 0, E)
Command: "F"
Result: (1, 0, E)
```

**Complex Sequence**:
```
Initial: (0, 0, N)
Command: "FFRFF"
Result: (2, 2, E)
Explanation:
  F → (0, 1, N)
  F → (0, 2, N)
  R → (0, 2, E)
  F → (1, 2, E)
  F → (2, 2, E)
```

**Turn Around**:
```
Initial: (0, 0, N)
Command: "LL"
Result: (0, 0, S)
```

**Square Pattern**:
```
Initial: (0, 0, N)
Command: "FRFRFRF"
Result: (0, 0, W)
Explanation: Rover traces 3 sides of a 1x1 square
```

## Task

Implement the Mars Rover based on the rules and examples above.

## Expected Output Files

- `src/mars-rover.ts` - Implementation
- `src/mars-rover.spec.ts` - Tests

## Constraints

- Use TypeScript
- Each command character is one of: 'F', 'L', 'R'
- Position coordinates can be negative
- Commands are case-sensitive (uppercase only)
- Focus on core rover movement (no obstacles or grid boundaries for base kata)

