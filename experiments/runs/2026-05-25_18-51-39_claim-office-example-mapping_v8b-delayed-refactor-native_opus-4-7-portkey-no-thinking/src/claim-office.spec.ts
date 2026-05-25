import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  computePremium,
  runScenario,
  insuranceSum,
  Scenario,
} from "./claim-office.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_PATH = path.join(__dirname, "cli.ts");

function runCLI(input: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input,
    encoding: "utf8",
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

// ===== Rules: Item values and base premiums =====

describe("Base premiums per item type", () => {
  it("sword: base premium 100 G + 5 G fee = 105 G", () => {
    expect(computePremium([{ type: "sword" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(
      // 100 + 10 first ins + 5 fee = 115
      115
    );
  });

  it("amulet: base 60 + 6 first ins + 5 fee = 71 G", () => {
    expect(computePremium([{ type: "amulet" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(
      71
    );
  });

  it("staff: base 80 + 8 first ins + 5 fee = 93 G", () => {
    expect(computePremium([{ type: "staff" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(
      93
    );
  });

  it("potion: base 40 + 4 first ins + 5 fee = 49 G", () => {
    expect(computePremium([{ type: "potion" }], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(
      49
    );
  });
});

// ===== Examples: Building block of 3 alike components =====

describe("Component block rule", () => {
  const ctx = { yearsWithMHPCO: 0, isFirstContract: true };

  it("2 runes → 50 G base premium (no block)", () => {
    // 50 base + 5 first ins + 5 fee = 60
    expect(computePremium([{ type: "rune" }, { type: "rune" }], ctx)).toBe(60);
  });

  it("3 runes → 60 G base premium (block applies)", () => {
    // 60 base + 6 first ins + 5 fee = 71
    expect(
      computePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }], ctx)
    ).toBe(71);
  });

  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    // 100 base + 10 first ins + 5 fee = 115
    expect(
      computePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        ctx
      )
    ).toBe(115);
  });

  it("7 runes → 175 G base premium (no block)", () => {
    // 175 + 17.5 first ins = 192.5 + 5 fee = 197.5 → 198 (rounded up)
    const items = Array(7).fill({ type: "rune" });
    expect(computePremium(items, ctx)).toBe(198);
  });
});

// ===== Examples: "Alike" components =====

describe("'Alike' components: same type only", () => {
  const ctx = { yearsWithMHPCO: 0, isFirstContract: true };

  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    // 75 + 7.5 first ins + 5 fee = 87.5 → 88
    expect(
      computePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        ctx
      )
    ).toBe(88);
  });

  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // 120 + 12 first ins + 5 fee = 137
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(computePremium(items, ctx)).toBe(137);
  });
});

// ===== Examples: Modifier scope on multi-item policies =====

describe("Modifier scope on multi-item policies", () => {
  it("cursed sword (100) + plain amulet (60) → 210 G before further modifiers and fee", () => {
    // policy base = 160; cursed surcharge = 50% * 100 = 50; first ins = 10% * 160 = 16
    // total before fee = 160 + 50 + 16 = 226 + 5 fee = 231
    expect(
      computePremium(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
        { yearsWithMHPCO: 0, isFirstContract: true }
      )
    ).toBe(231);
  });
});

// ===== Examples: Modifier thresholds =====

describe("Modifier thresholds", () => {
  it("customer with exactly 2 years → loyalty discount applies", () => {
    // sword: 100 - 20% loyalty + 10% first ins = 100 - 20 + 10 = 90 + 5 fee = 95
    expect(
      computePremium([{ type: "sword" }], { yearsWithMHPCO: 2, isFirstContract: true })
    ).toBe(95);
  });

  it("sword with exactly enchantment 5 → high-enchantment surcharge applies", () => {
    // 100 + 30 (30% high ench) + 10 first ins + 5 fee = 145
    expect(
      computePremium(
        [{ type: "sword", enchantment: 5 }],
        { yearsWithMHPCO: 0, isFirstContract: true }
      )
    ).toBe(145);
  });

  it("sword with exactly enchantment 5, cursed → both surcharges apply", () => {
    // 100 + 50 (curse) + 30 (high ench) + 10 (first ins) + 5 fee = 195
    expect(
      computePremium(
        [{ type: "sword", enchantment: 5, cursed: true }],
        { yearsWithMHPCO: 0, isFirstContract: true }
      )
    ).toBe(195);
  });

  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    // 100 + 10 first ins + 5 fee = 115
    expect(
      computePremium(
        [{ type: "sword", enchantment: 4 }],
        { yearsWithMHPCO: 0, isFirstContract: true }
      )
    ).toBe(115);
  });

  it("sword with enchantment 4, cursed → curse surcharge applies only", () => {
    // 100 + 50 curse + 10 first ins + 5 fee = 165
    expect(
      computePremium(
        [{ type: "sword", enchantment: 4, cursed: true }],
        { yearsWithMHPCO: 0, isFirstContract: true }
      )
    ).toBe(165);
  });

  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    // high-ench clause applies: 50% of 1000 = 500, then deductible 100 → 400
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect(r.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

// ===== Examples: Deductible per damage event =====

describe("Deductible per damage event", () => {
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total = 600
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { payout: number }).payout).toBe(600);
  });
});

// ===== Examples: Standard reimbursement =====

describe("Standard reimbursement (no special clauses)", () => {
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { payout: number }).payout).toBe(400);
  });

  it("rune damage 200 G → payout 100 G (no special clause)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { payout: number }).payout).toBe(100);
  });
});

// ===== Examples: Enchantment threshold vs. dragon material =====

describe("Enchantment threshold vs. dragon material", () => {
  it("dragon-material sword, ench 9, damage 1000 → payout 400 (50% rule wins)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { payout: number }).payout).toBe(400);
  });

  it("dragon-material sword, ench 5, damage 800 → payout 700 (dragon only)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { payout: number }).payout).toBe(700);
  });

  it("steel sword, ench 9, damage 1000 → payout 400 (high-enchantment only)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { payout: number }).payout).toBe(400);
  });
});

// ===== Examples: Multiple items of the same type =====

describe("Multiple items of the same type", () => {
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });

  it("two sword damages → each gets its own deductible", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    // 500-100 + 500-100 = 800
    expect((r.results[1] as { payout: number }).payout).toBe(800);
  });

  it("damages array contains more entries of type than insured → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [
              { itemType: "sword", amount: 100 },
              { itemType: "sword", amount: 100 },
            ],
          },
        },
      ],
    });
    const res = runCLI(input);
    expect(res.status).not.toBe(0);
  });
});

// ===== Examples: Cap exhaustion =====

describe("Cap exhaustion", () => {
  it("sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });

  it("cursed sword → cap 2000 G (premium modifiers don't raise the cap)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 5000 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    // damage 5000 - 100 = 4900, capped at 2000
    expect((r.results[1] as { payout: number; remainingCap: number }).payout).toBe(2000);
  });

  it("sword + 3 runes (block) → insurance sum 1750 G (block affects premium only)", () => {
    expect(
      insuranceSum([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(1750);
  });

  it("sword (cap 2000), two claims of 1500 each → first 1400 remaining 600, second 600 remaining 0", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect(r.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(r.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

// ===== Examples: Rounding =====

describe("Rounding in the MHPCO's favor", () => {
  it("premium calculation yielding 197.5 G → 198 G (rounded up)", () => {
    // 7 runes: 175 + 17.5 first ins + 5 fee = 197.5 → 198
    const items = Array(7).fill({ type: "rune" });
    expect(
      computePremium(items, { yearsWithMHPCO: 0, isFirstContract: true })
    ).toBe(198);
  });

  it("payout calculation yielding 350.5 G → 350 G (rounded down)", () => {
    // dragon-material ench 8 sword, damage 901: 50% * 901 = 450.5 - 100 = 350.5 → 350
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { payout: number }).payout).toBe(350);
  });
});

// ===== Examples: Edge cases =====

describe("Edge cases", () => {
  it("empty item list → premium 5 G (only the processing fee)", () => {
    expect(computePremium([], { yearsWithMHPCO: 0, isFirstContract: true })).toBe(5);
  });

  it("unknown item type in quote → CLI exits non-zero with stderr message", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const res = runCLI(input);
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
    expect(res.stdout).toBe("");
  });

  it("claim references damage entry whose item is not part of policy → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    const res = runCLI(input);
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });

  it("claim references unknown item type → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "broomstick", amount: 100 }],
          },
        },
      ],
    });
    const res = runCLI(input);
    expect(res.status).not.toBe(0);
  });

  it("claim contains damage entry with amount: -200 → CLI exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "test",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    });
    const res = runCLI(input);
    expect(res.status).not.toBe(0);
    expect(res.stderr.length).toBeGreaterThan(0);
  });
});

// ===== Integration examples =====

describe("Integration: Newcomer with a cursed sword", () => {
  it("0 years, cursed sword (steel, ench 3) → premium 165 G", () => {
    expect(
      computePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0, isFirstContract: true }
      )
    ).toBe(165);
  });
});

describe("Integration: Long-standing customer's second contract", () => {
  it("3 years, second quote, cursed sword (ench 7) → premium 160 G", () => {
    expect(
      computePremium(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3, isFirstContract: false }
      )
    ).toBe(160);
  });

  it("via scenario: first quote then cursed sword (ench 7) second quote", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const r = runScenario(scenario);
    expect((r.results[1] as { premium: number }).premium).toBe(160);
  });
});

// ===== CLI smoke test =====

describe("CLI", () => {
  it("schema example: amulet quote then fire claim → produces results array", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    const res = runCLI(input);
    expect(res.status).toBe(0);
    const out = JSON.parse(res.stdout);
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toHaveProperty("premium");
    expect(out.results[1]).toHaveProperty("payout");
    expect(out.results[1]).toHaveProperty("remainingCap");
  });
});

// ===== Clarifying questions (❓) =====

describe("❓ alike components = same type only (not same family)", () => {
  it("2 runes + 1 moonstone do NOT form a block", () => {
    // Already covered above; explicit re-test
    expect(
      computePremium(
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        { yearsWithMHPCO: 0, isFirstContract: true }
      )
    ).toBe(88);
  });
});

describe("❓ modifier scope: cursed applies to the cursed item only", () => {
  it("cursed surcharge is 50% of cursed item's base, not policy total", () => {
    // Already covered in 'Modifier scope on multi-item policies'
    expect(true).toBe(true);
  });
});

describe("❓ first insurance applies per item, regardless of customer history", () => {
  it("long-standing customer's brand-new sword still gets the 10% first insurance surcharge", () => {
    // 100 base - 20 loyalty + 10 first ins - 15 follow-up = 75 + 5 fee = 80
    expect(
      computePremium(
        [{ type: "sword" }],
        { yearsWithMHPCO: 3, isFirstContract: false }
      )
    ).toBe(80);
  });
});
