import { describe, it, expect } from "vitest";
import { execSync } from "child_process";

describe("CLI", () => {
  it("should read JSON from stdin and write resulting alive cells as JSON to stdout", () => {
    const input = JSON.stringify({ aliveCells: [[0, 0], [1, 0], [2, 0]], steps: 1 });
    const result = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
      encoding: "utf-8",
    });
    const output = JSON.parse(result.trim());
    expect(output).toEqual({ aliveCells: [[1, -1], [1, 0], [1, 1]] });
  });
});
