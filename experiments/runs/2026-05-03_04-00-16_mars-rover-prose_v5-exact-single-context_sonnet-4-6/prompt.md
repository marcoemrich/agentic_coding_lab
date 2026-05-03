# Mars Rover Kata

## Feature

NASA has landed a small squad of robotic rovers on a plateau on Mars. Each rover knows where it is and which way it is pointing: its position is given by integer coordinates (x, y) and its heading is one of the four cardinal directions north, east, south or west. Mission control communicates with a rover by sending a string of single-character commands. The command 'L' rotates the rover ninety degrees to the left without moving it; 'R' rotates it ninety degrees to the right. The command 'F' moves the rover one grid square forward in the direction it is currently facing: north increases the y coordinate, east increases the x coordinate, south decreases y, west decreases x. The rover executes the commands one after the other, in the order they appear in the string.

## Task

Implement the rover so that, given an initial position and heading and a command string, it returns the final position and heading.

## Expected Output Files

- `src/mars-rover.ts` - Implementation
- `src/mars-rover.spec.ts` - Tests

## Constraints

- Use TypeScript
- Each command character is one of: 'F', 'L', 'R'
- Position coordinates can be negative
- Commands are case-sensitive (uppercase only)
- Focus on core rover movement (no obstacles or grid boundaries for base kata)
