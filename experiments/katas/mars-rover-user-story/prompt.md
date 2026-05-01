# Mars Rover Kata

## User Story

**As a** mission controller at NASA
**I want** to send a sequence of commands to a Mars rover and learn its resulting position and heading
**so that** I can plan exploration paths from Earth without manually simulating each step.

## Acceptance Criteria

- A rover has a position given by integer (x, y) coordinates and a heading of N, E, S or W.
- The command 'L' rotates the rover ninety degrees counterclockwise without changing its position.
- The command 'R' rotates the rover ninety degrees clockwise without changing its position.
- The command 'F' moves the rover one unit forward in its current heading.
- A command string is executed left to right, applying commands one after the other.
- The result returned by the rover is its final position and heading after all commands have been processed.
- Coordinates may become negative; there are no grid boundaries.

## Expected Output Files

- `src/mars-rover.ts` - Implementation
- `src/mars-rover.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Each command character is one of: 'F', 'L', 'R'
- Position coordinates can be negative
- Commands are case-sensitive (uppercase only)
- Focus on core rover movement (no obstacles or grid boundaries for base kata)
