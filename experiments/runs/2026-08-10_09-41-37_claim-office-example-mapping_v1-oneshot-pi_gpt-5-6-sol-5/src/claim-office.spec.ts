import { describe, expect, it } from "vitest";
import { InputError, runScenario } from "./claim-office.js";

const scenario = (steps: unknown[], yearsWithMHPCO = 0) => ({
  customer: { yearsWithMHPCO }, steps,
});

const quote = (items: unknown[]) => ({ op: "quote", items });
const claim = (policy: number, damages: unknown[]) => ({
  op: "claim", policy, incident: { cause: "test", damages },
});

describe("quotes", () => {
  it("calculates blocks, isolated item modifiers, and customer modifiers", () => {
    expect(runScenario(scenario([quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
    ])])).results[0]).toEqual({ premium: 71 });
    expect(runScenario(scenario([quote([
      { type: "sword", cursed: true }, { type: "amulet" },
    ])])).results[0]).toEqual({ premium: 231 });
    expect(runScenario(scenario([
      quote([]), quote([{ type: "sword", cursed: true, enchantment: 7 }]),
    ], 3)).results).toEqual([{ premium: 5 }, { premium: 160 }]);
  });

  it("only makes exact, same-type groups of three into blocks", () => {
    const premiums = [2, 3, 4, 7].map((count) => runScenario(scenario([
      quote(Array.from({ length: count }, () => ({ type: "rune" }))),
    ])).results[0]);
    expect(premiums).toEqual([
      { premium: 60 }, { premium: 71 }, { premium: 115 }, { premium: 198 },
    ]);
    expect(runScenario(scenario([quote([
      { type: "rune" }, { type: "rune" }, { type: "moonstone" },
    ])])).results[0]).toEqual({ premium: 88 });
  });
});

describe("claims", () => {
  it("applies reimbursement, per-item deductibles, rounding, and cap exhaustion", () => {
    const output = runScenario(scenario([
      quote([{ type: "sword", material: "dragon", enchantment: 9 }]),
      claim(0, [{ itemType: "sword", amount: 1000 }]),
      claim(0, [{ itemType: "sword", amount: 3001 }]),
      claim(0, [{ itemType: "sword", amount: 1000 }]),
    ]));
    expect(output.results.slice(1)).toEqual([
      { payout: 400, remainingCap: 1600 },
      { payout: 1400, remainingCap: 200 },
      { payout: 200, remainingCap: 0 },
    ]);
  });

  it("matches repeated damages to distinct insured items", () => {
    const output = runScenario(scenario([
      quote([{ type: "sword" }, { type: "sword", enchantment: 8 }]),
      claim(0, [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ]),
    ]));
    expect(output.results[1]).toEqual({ payout: 550, remainingCap: 3450 });
  });
});

describe("validation", () => {
  it.each([
    scenario([quote([{ type: "broomstick" }])]),
    scenario([quote([{ type: "sword" }]), claim(0, [{ itemType: "amulet", amount: 2 }])]),
    scenario([quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -2 }])]),
    scenario([claim(0, [])]),
  ])("rejects invalid scenarios", (input) => {
    expect(() => runScenario(input)).toThrow(InputError);
  });
});
