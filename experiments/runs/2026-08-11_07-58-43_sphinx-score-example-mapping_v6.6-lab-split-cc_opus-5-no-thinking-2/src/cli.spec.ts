import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { scoreDocument } from "./cli.js";

const runCli = (stdin: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const cli = execFile(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      (error, stdout) => (error ? reject(error) : resolve(stdout)),
    );
    cli.stdin?.end(stdin);
  });

describe("Sphinx scoring CLI", () => {
  it('scores an input document into an output document — {"army":[]} yields {"score":0}', () => {
    expect(scoreDocument('{"army":[]}')).toBe('{"score":0}');
  });
  it('delegates scoring to the army rules — the spec\'s example document yields {"score":2}', () => {
    const document =
      '{"army":[{"monster":"sphinx"},{"monster":"undead-warrior","rank":2},{"monster":"hydra"}]}';

    expect(scoreDocument(document)).toBe('{"score":2}');
  });
  it("passes Undead Warrior rank through to the scorer — variants count as one type", () => {
    const document =
      '{"army":[{"monster":"sphinx"},' +
      '{"monster":"undead-warrior","rank":1},' +
      '{"monster":"undead-warrior","rank":2},' +
      '{"monster":"undead-warrior","rank":3},' +
      '{"monster":"cyclops"},{"monster":"orthrus"},{"monster":"chimera"}]}';

    expect(scoreDocument(document)).toBe('{"score":3}');
  });
  it("runs as `pnpm exec tsx src/cli.ts`, reading stdin and writing the score to stdout", async () => {
    const document =
      '{"army":[{"monster":"sphinx"},{"monster":"undead-warrior","rank":2},{"monster":"hydra"}]}';

    await expect(runCli(document)).resolves.toContain('{"score":2}');
  }, 60_000);
});
