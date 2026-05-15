// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { spawnSync } from "child_process";
import { quote, claim } from "./claim-office.js";

const runCli = (input: string) => {
  const result = spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
};

describe("MHPCO Claim Office - quote", () => {
  // Empty / processing fee
  it("empty item list yields premium 5 G (only processing fee)", () => {
    expect(quote({ items: [], customer: { yearsInsured: 0, previousQuotes: 0 } })).toBe(5);
  });

  // Single main item base premiums
  it("single plain sword (newcomer, first insurance) yields 115 G (100 base + 10 first + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(115);
  });
  it("single plain amulet (newcomer, first insurance) yields 71 G (60 base + 6 first + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "amulet", material: "steel", enchantment: 0, cursed: false }],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(71);
  });
  it("single plain staff (newcomer, first insurance) yields 93 G (80 base + 8 first + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "staff", material: "steel", enchantment: 0, cursed: false }],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(93);
  });
  it("single plain potion (newcomer, first insurance) yields 49 G (40 base + 4 first + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "potion", material: "steel", enchantment: 0, cursed: false }],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(49);
  });

  // Components - building block rule
  it("2 runes yields base premium 50 G (25 each, no block)", () => {
    expect(
      quote({
        items: [
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
        ],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(60);
  });
  it("3 runes yields base premium 60 G (block applies)", () => {
    expect(
      quote({
        items: [
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
        ],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(71);
  });
  it("4 runes yields base premium 100 G (no block - requires exactly 3)", () => {
    expect(
      quote({
        items: [
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
        ],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(115);
  });
  it("7 runes yields base premium 175 G (one block of 3 + 4 singles)", () => {
    expect(
      quote({
        items: [
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
        ],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(181);
  });

  // Alike components
  it("2 runes + 1 moonstone yields base premium 75 G (different types, no block)", () => {
    expect(
      quote({
        items: [
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
        ],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(88);
  });
  it("3 runes + 3 moonstones yields base premium 120 G (two separate blocks)", () => {
    expect(
      quote({
        items: [
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
          { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
          { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
        ],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(137);
  });

  // Item-specific modifiers: cursed
  it("cursed sword (newcomer) yields 165 G (100 base + 50 curse + 10 first + 5 fee)", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(165);
  });

  // Item-specific modifiers: high enchantment
  it("sword with enchantment exactly 5 (newcomer) triggers high-enchantment surcharge", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(145);
  });
  it("sword with enchantment 4 (newcomer) does not trigger high-enchantment surcharge", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(115);
  });

  // Modifier scope on multi-item policies
  it("policy with cursed sword and plain amulet: curse surcharge applies only to sword's base premium", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: true },
          { type: "amulet", material: "steel", enchantment: 0, cursed: false },
        ],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(231);
  });

  // Policy-wide modifiers: loyalty
  it("customer with exactly 2 years receives 20% loyalty discount", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        customer: { yearsInsured: 2, previousQuotes: 0 },
      })
    ).toBe(95);
  });

  // Policy-wide modifiers: follow-up contract
  it("customer's second quote receives 15% follow-up discount", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        customer: { yearsInsured: 0, previousQuotes: 1 },
      })
    ).toBe(100);
  });

  // Rounding
  it("premium calculation yielding 197.5 G rounds up to 198 G (in MHPCO's favor)", () => {
    expect(
      quote({
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
        ],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(198);
  });

  // Integration examples
  it("newcomer with cursed sword (steel, enchantment 3) yields 165 G", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        customer: { yearsInsured: 0, previousQuotes: 0 },
      })
    ).toBe(165);
  });
  it("long-standing customer (3 years) second quote, cursed sword enchantment 7 yields 160 G", () => {
    expect(
      quote({
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        customer: { yearsInsured: 3, previousQuotes: 1 },
      })
    ).toBe(160);
  });
});

describe("MHPCO Claim Office - claim", () => {
  // Standard reimbursement
  it("regular sword (steel, enchantment 3), damage 500 G yields payout 400 G", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      damages: [{ itemType: "sword", amount: 500 }],
    });
    expect(result.payout).toBe(400);
  });
  it("rune damage 200 G yields payout 100 G", () => {
    const result = claim({
      items: [{ type: "rune", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ itemType: "rune", amount: 200 }],
    });
    expect(result.payout).toBe(100);
  });

  // Deductible per damage event
  it("dragon attack damaging sword (500 G) and amulet (300 G) yields payout 600 G", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "steel", enchantment: 0, cursed: false },
      ],
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  // High enchantment threshold
  it("steel sword enchantment 9, damage 1000 G yields payout 400 G (50% then deductible)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  // Dragon material
  it("dragon-material sword enchantment 5, damage 800 G yields payout 700 G (full minus deductible)", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
      damages: [{ itemType: "sword", amount: 800 }],
    });
    expect(result.payout).toBe(700);
  });

  // Both clauses: enchantment >= 8 wins (50% rule)
  it("dragon-material sword enchantment 9, damage 1000 G yields payout 400 G", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword enchantment exactly 8, damage 1000 G yields payout 400 G", () => {
    const result = claim({
      items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
      damages: [{ itemType: "sword", amount: 1000 }],
    });
    expect(result.payout).toBe(400);
  });

  // Cap based on unmodified insurance sum
  it("cursed sword has cap 2000 G (based on unmodified insurance value)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
      damages: [],
    });
    expect(result.remainingCap).toBe(2000);
  });
  it("sword + 3 runes policy has insurance sum 1750 G (block discount doesn't affect insurance sum)", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "rune", material: "steel", enchantment: 0, cursed: false },
        { type: "rune", material: "steel", enchantment: 0, cursed: false },
        { type: "rune", material: "steel", enchantment: 0, cursed: false },
      ],
      damages: [],
    });
    expect(result.remainingCap).toBe(3500);
  });

  // Cap exhaustion across multiple claims
  it("sword (cap 2000): first claim 1500 G yields payout 1400 G, remaining cap 600 G", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ itemType: "sword", amount: 1500 }],
    });
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("sword (cap 2000) after first 1400 G payout: second claim 1500 G yields payout 600 G, remaining cap 0", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
      damages: [{ itemType: "sword", amount: 1500 }],
      remainingCap: 600,
    });
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });

  // Multiple items of same type
  it("policy with two swords: dragon attack on both treats each as separate damage with own deductible", () => {
    const result = claim({
      items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ],
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(3200);
  });

  // Rounding for payout
  it("payout calculation yielding 350.5 G rounds down to 350 G (in MHPCO's favor)", () => {
    const result = claim({
      items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      damages: [{ itemType: "sword", amount: 901 }],
    });
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO Claim Office - CLI", () => {
  it("reads scenario JSON from stdin and writes results JSON to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsInsured: 0, previousQuotes: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote step result contains premium (integer)", () => {
    const input = JSON.stringify({
      customer: { yearsInsured: 0, previousQuotes: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results).toHaveLength(1);
    expect(parsed.results[0]).toHaveProperty("premium");
    expect(Number.isInteger(parsed.results[0].premium)).toBe(true);
    expect(parsed.results[0].premium).toBe(115);
  });
  it("claim step result contains payout and remainingCap (integers)", () => {
    const input = JSON.stringify({
      customer: { yearsInsured: 0, previousQuotes: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results).toHaveLength(2);
    expect(parsed.results[1]).toHaveProperty("payout");
    expect(parsed.results[1]).toHaveProperty("remainingCap");
    expect(Number.isInteger(parsed.results[1].payout)).toBe(true);
    expect(Number.isInteger(parsed.results[1].remainingCap)).toBe(true);
    expect(parsed.results[1].payout).toBe(400);
    expect(parsed.results[1].remainingCap).toBe(1600);
  });
  it("claim references policy by zero-based step index", () => {
    const input = JSON.stringify({
      customer: { yearsInsured: 0, previousQuotes: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 1,
          incident: { damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    const { stdout, status } = runCli(input);
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results).toHaveLength(3);
    expect(parsed.results[2].payout).toBe(400);
    expect(parsed.results[2].remainingCap).toBe(1600);
  });

  // Error cases
  it("unknown item type in quote exits non-zero with stderr message and no results on stdout", () => {
    const input = JSON.stringify({
      customer: { yearsInsured: 0, previousQuotes: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    const { stdout, stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe("");
  });
  it("claim referencing item not in policy exits non-zero with stderr message", () => {
    const input = JSON.stringify({
      customer: { yearsInsured: 0, previousQuotes: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    const { stdout, stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe("");
  });
  it("claim with negative damage amount exits non-zero with stderr message", () => {
    const input = JSON.stringify({
      customer: { yearsInsured: 0, previousQuotes: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { damages: [{ itemType: "sword", amount: -100 }] },
        },
      ],
    });
    const { stdout, stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe("");
  });
  it("claim with more damage entries of a type than policy covers exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsInsured: 0, previousQuotes: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });
    const { stdout, stderr, status } = runCli(input);
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe("");
  });
});
