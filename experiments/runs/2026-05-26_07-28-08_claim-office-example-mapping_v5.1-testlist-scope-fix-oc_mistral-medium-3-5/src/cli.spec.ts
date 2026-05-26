import { describe, it, expect } from "vitest";
import { execSync } from "child_process";

const claimOffice = (input: string): string => {
  return execSync("tsx src/cli.ts", { input, encoding: "utf-8" });
};

describe("claim-office CLI", () => {
  it("empty item list quote -> premium 5 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[0].premium).toBe(5);
  });

  it("single sword quote -> premium 115 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[0].premium).toBe(115);
  });

  it("3 runes quote -> premium 71 G (block)", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[0].premium).toBe(71);
  });

  it("cursed sword quote -> premium 165 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[0].premium).toBe(165);
  });

  it("sword with enchantment 5 quote -> premium 145 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[0].premium).toBe(145);
  });

  it("customer with 2 years loyalty quote -> premium 95 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[0].premium).toBe(95);
  });

  it("customer with 3 years, second contract quote -> premium 80 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].premium).toBe(80);
  });

  it("cursed sword + plain amulet quote -> premium 231 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[0].premium).toBe(231);
  });

  it("newcomer with cursed sword -> premium 165 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[0].premium).toBe(165);
  });

  it("long-standing customer's second contract with cursed sword -> premium 160 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].premium).toBe(160);
  });

  it("claim: regular sword damage 500 G -> payout 400 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  it("claim: rune damage 200 G -> payout 100 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(400);
  });

  it("claim: dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  it("claim: dragon-material sword, enchantment 5, damage 800 G -> payout 700 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(700);
    expect(result.results[1].remainingCap).toBe(1300);
  });

  it("claim: steel sword, enchantment 9, damage 1000 G -> payout 400 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  it("claim: dragon attack damages sword and amulet -> payout 600 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 }
        ] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(600);
    expect(result.results[1].remainingCap).toBe(2600);
  });

  it("claim: sword policy, damage 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
  });

  it("claim: sword policy after first claim, second damage 1500 G -> payout 600 G, remainingCap 0 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  it("claim: two swords policy, both damaged -> payout 800 G", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 }
        ] } }
      ]
    });
    const output = claimOffice(input);
    const result = JSON.parse(output);
    expect(result.results[1].payout).toBe(800);
    expect(result.results[1].remainingCap).toBe(3200);
  });

  it("quote with unknown item type -> exits with non-zero status", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
    });
    expect(() => claimOffice(input)).toThrow();
  });

  it("claim with damage entry for item not in policy -> exits with non-zero status", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] } }
      ]
    });
    expect(() => claimOffice(input)).toThrow();
  });

  it("claim with negative damage amount -> exits with non-zero status", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    });
    expect(() => claimOffice(input)).toThrow();
  });

  it("claim with more damage entries than policy covers -> exits with non-zero status", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 }
        ] } }
      ]
    });
    expect(() => claimOffice(input)).toThrow();
  });
});
