import { describe, it, expect } from "vitest";
import { execSync } from "child_process";

describe("CLI", () => {
  it("should read JSON from stdin and write result JSON to stdout", () => {
    const input = JSON.stringify({ aliveCells: [[0, 0], [0, 1], [0, 2]], steps: 1 });
    const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
      encoding: "utf-8",
    });
    const result = JSON.parse(output.trim());
    expect(result).toEqual({ aliveCells: [[-1, 1], [0, 1], [1, 1]] });
  });
});
