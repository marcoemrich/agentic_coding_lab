import { describe, it, expect } from "vitest";
import { Readable } from "node:stream";
import { runCli } from "./cli.js";

const stdinOf = (...chunks: string[]): Readable => Readable.from(chunks);

describe("Sphinx scoring CLI", () => {
  it('writes the score as a JSON document — {"army":[{"monster":"sphinx"},{"monster":"cyclops"}]} → {"score":2}', async () => {
    const input = JSON.stringify({
      army: [{ monster: "sphinx" }, { monster: "cyclops" }],
    });

    await expect(runCli(stdinOf(input))).resolves.toBe('{"score":2}');
  });
  it('reads Undead Warrior rank fields from the input — the spec example {"army":[sphinx, undead-warrior rank 2, hydra]} → {"score":2}', async () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ],
    });

    await expect(runCli(stdinOf(input))).resolves.toBe('{"score":2}');
  });
  it("reads the whole of stdin before producing output, even when it arrives in several chunks", async () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ],
    });
    const middle = Math.floor(input.length / 2);

    await expect(
      runCli(stdinOf(input.slice(0, middle), input.slice(middle))),
    ).resolves.toBe('{"score":3}');
  });
});
