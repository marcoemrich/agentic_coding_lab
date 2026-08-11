import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { scoreArmy } from "./sphinx-score.js";

const runCli = (input: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const cli = execFile(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      (error, stdout, stderr) =>
        error ? reject(new Error(`${error.message}\n${stderr}`)) : resolve(stdout),
    );
    cli.stdin?.end(input);
  });

describe("Sphinx scoring", () => {
  it("scores an army without a Sphinx as 0 — Chimera, Orthrus, Zombie → 0", () => {
    expect(
      scoreArmy([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("scores a Sphinx seeing one other type as 2 — Sphinx, Cyclops → 2", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores a Sphinx seeing two other types as 2 — Sphinx, Chimera, Orthrus → 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("ignores duplicate cards of the same monster — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ]),
    ).toBe(3);
  });
  it("scores 2 for each further type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ]),
    ).toBe(5);
  });
  it("counts another Sphinx as a type — Sphinx, Sphinx, Chimera, Orthrus → 4", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores each Sphinx separately beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(6);
  });
  it("treats Undead Warrior variants as one type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("treats all three Undead Warrior variants as one type — Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3), Cyclops, Orthrus, Chimera → 3", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 2 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "cyclops" },
        { monster: "orthrus" },
        { monster: "chimera" },
      ]),
    ).toBe(3);
  });
});

describe("Sphinx scoring CLI", () => {
  it("reads an army from stdin and writes the score to stdout", async () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ],
    });

    const stdout = await runCli(input);

    expect(JSON.parse(stdout)).toEqual({ score: 2 });
  });
});
