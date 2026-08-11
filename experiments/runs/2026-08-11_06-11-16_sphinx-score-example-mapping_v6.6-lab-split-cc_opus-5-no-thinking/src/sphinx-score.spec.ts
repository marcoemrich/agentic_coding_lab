import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { scoreArmy } from "./sphinx-score.js";

const cliPath = fileURLToPath(new URL("./cli.ts", import.meta.url));

const runCli = (input: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = execFile(
      "pnpm",
      ["exec", "tsx", cliPath],
      (error, stdout, stderr) => {
        if (error) reject(new Error(`${error.message}\n${stderr}`));
        else resolve(stdout);
      },
    );
    child.stdin?.end(input);
  });

describe("Sphinx scoring", () => {
  it("scores an army with no Sphinx as 0 — Chimera, Orthrus, Zombie → 0 points", () => {
    expect(
      scoreArmy([
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
      ]),
    ).toBe(0);
  });
  it("counts the Sphinx itself as a type — Sphinx, Cyclops → 2 points", () => {
    expect(scoreArmy([{ monster: "sphinx" }, { monster: "cyclops" }])).toBe(2);
  });
  it("scores 1 point plus 1 when the army has exactly three types — Sphinx, Chimera, Orthrus → 2 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(2);
  });
  it("scores 2 per type beyond three — Sphinx, Chimera, Orthrus, Zombie, Hydra → 3 points", () => {
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
  it("scores 2 per type beyond three with two extra types — Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → 5 points", () => {
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
  it("scores each Sphinx separately, both counting the Sphinx type once — Sphinx, Sphinx, Chimera, Orthrus → 4 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
      ]),
    ).toBe(4);
  });
  it("scores each Sphinx separately beyond three types — Sphinx, Sphinx, Chimera, Orthrus, Zombie → 6 points", () => {
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
  it("treats Undead Warrior variants as a single type — Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → 2 points", () => {
    expect(
      scoreArmy([
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 1 },
        { monster: "undead-warrior", rank: 3 },
        { monster: "chimera" },
      ]),
    ).toBe(2);
  });
  it("treats all three Undead Warrior variants as one type among many — Sphinx, Undead Warrior (1), (2), (3), Cyclops, Orthrus, Chimera → 3 points", () => {
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
  it("counts duplicate cards of the same monster as one type — Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → 2 points", () => {
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
});

describe("CLI", () => {
  it("reads an army JSON document from stdin and writes the score as JSON to stdout", async () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ],
    });

    const stdout = await runCli(input);

    expect(JSON.parse(stdout)).toEqual({ score: 5 });
  });
});
