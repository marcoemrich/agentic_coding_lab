import { describe, it, expect } from "vitest";
import { scoreDocument } from "./cli.js";

describe("Sphinx scoring CLI", () => {
  it("scores the spec's example document — { army: [sphinx, undead-warrior rank 2, hydra] } yields { score: 1 }", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "undead-warrior", rank: 2 },
        { monster: "hydra" },
      ],
    });

    expect(JSON.parse(scoreDocument(input))).toEqual({ score: 1 });
  });

  it("scores an empty army document — { army: [] } yields { score: 0 }", () => {
    expect(JSON.parse(scoreDocument(JSON.stringify({ army: [] })))).toEqual({
      score: 0,
    });
  });
  it("scores a beyond-three-types document — { army: [sphinx, hydra, zombie, cyclops] } yields { score: 2 }", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "hydra" },
        { monster: "zombie" },
        { monster: "cyclops" },
      ],
    });

    expect(JSON.parse(scoreDocument(input))).toEqual({ score: 2 });
  });
  it("tolerates surrounding whitespace in the input document", () => {
    const document = JSON.stringify({ army: [{ monster: "sphinx" }] });

    expect(JSON.parse(scoreDocument(`\n  ${document}  \n`))).toEqual({
      score: 1,
    });
  });
});
