import { describe, it, expect } from "vitest";
import { quote, claim, insuranceSum, cap } from "./claim-office.js";
import { execFileSync } from "node:child_process";

const runCli = (input: unknown): { status: number; stdout: string; stderr: string } => {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
    });
    return { status: 0, stdout, stderr: "" };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return {
      status: err.status ?? 1,
      stdout: err.stdout ?? "",
      stderr: err.stderr ?? "",
    };
  }
};

describe("MHPCO Claim Office - quote", () => {
  // Empty / processing fee
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });

  // Base premiums for main items (newcomer 0 years: base + first insurance 10% + fee)
  it("single sword (newcomer) -> base 100 + 10 first-insurance + 5 fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("single amulet (newcomer) -> base 60 + 6 + 5 = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("single staff (newcomer) -> base 80 + 8 + 5 = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("single potion (newcomer) -> base 40 + 4 + 5 = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // Component base premiums / building block of 3 alike components
  it("2 runes -> 50 G base premium", () => {
    // newcomer: base 50 + 5 first-insurance + 5 fee = 60
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    // block base 60 + 6 first-insurance + 5 fee = 71
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 0)).toBe(71);
  });
  it("4 runes -> 100 G base premium (no block - block requires exactly 3)", () => {
    // 4*25=100 + 10 first-insurance + 5 fee = 115
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], 0)).toBe(115);
  });
  it("7 runes -> 175 G base premium", () => {
    // 7*25=175 + 17.5 first-insurance + 5 fee = 197.5 -> ceil 198
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(198);
  });

  // "Alike" components
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    // 3*25=75 + 7.5 first-insurance + 5 fee = 87.5 -> ceil 88
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 0)).toBe(88);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
    // 60 + 60 = 120 + 12 first-insurance + 5 fee = 137
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(137);
  });

  // Cursed / high enchantment surcharges in isolation (newcomer)
  it("cursed sword (steel, ench 3), newcomer -> 165 G (integration example)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge applies", () => {
    // 100 + 30 high-ench + 10 first + 5 fee = 145
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 0)).toBe(145);
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge", () => {
    // 100 + 10 first + 5 fee = 115
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 0)).toBe(115);
  });
  it("cursed sword with enchantment 5 -> both surcharges apply", () => {
    // 100 + 50 curse + 30 high-ench + 10 first + 5 fee = 195
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }], 0)).toBe(195);
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet -> curse surcharge = 50% of cursed item base only, 210 G before modifiers/fee", () => {
    // base 160, curse 50 (50% of sword base 100) = 210 before modifiers/fee
    // newcomer: + 16 first-insurance (10% of 160) + 5 fee = 231
    const items = [
      { type: "sword", cursed: true },
      { type: "amulet" },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(231);
  });

  // Loyalty discount threshold
  it("customer with exactly 2 years -> loyalty discount applies", () => {
    // 100 base - 20 loyalty (20% of 100) + 10 first + 5 fee = 95
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });

  // Follow-up contract discount + integration example
  it("long-standing customer's second contract (cursed sword ench 7, 3 years) -> 160 G", () => {
    // 100 + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee = 160
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 1)).toBe(160);
  });

  // Rounding in favor
  it("premium calculation yielding 197.5 -> final premium 198 (rounded up)", () => {
    // 7 runes: 175 base + 17.5 first-insurance + 5 fee = 197.5 -> ceil 198
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(198);
  });
});

describe("MHPCO Claim Office - claim", () => {
  // Standard reimbursement
  it("regular sword (steel, ench 3), damage 500 -> payout 400 (full - 100 deductible)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const result = claim(items, [{ itemType: "sword", amount: 500 }], 2000);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("rune (value 250), damage 200 -> payout 100 (full - 100 deductible)", () => {
    const items = [{ type: "rune" }];
    const result = claim(items, [{ itemType: "rune", amount: 200 }], 500);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });

  // High enchantment reimbursement
  it("steel sword, ench 9, damage 1000 -> payout 400 (50% then deductible)", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    const result = claim(items, [{ itemType: "sword", amount: 1000 }], 2000);
    expect(result.payout).toBe(400);
  });

  // Dragon material reimbursement
  it("dragon-material sword, ench 5, damage 800 -> payout 700 (full then deductible)", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const result = claim(items, [{ itemType: "sword", amount: 800 }], 2000);
    expect(result.payout).toBe(700);
  });

  // Both clauses -> 50% wins
  it("dragon-material sword, ench 9, damage 1000 -> payout 400 (50% wins, then deductible)", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const result = claim(items, [{ itemType: "sword", amount: 1000 }], 2000);
    expect(result.payout).toBe(400);
  });
  it("dragon-material sword, exactly ench 8, damage 1000 -> payout 400 (high-ench then deductible)", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const result = claim(items, [{ itemType: "sword", amount: 1000 }], 2000);
    expect(result.payout).toBe(400);
  });

  // Deductible per damage event
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible per item)", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const result = claim(
      items,
      [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
      3200
    );
    expect(result.payout).toBe(600);
  });

  // Insurance sum and cap
  it("policy covers two swords -> insurance sum 2000, cap 4000", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    expect(insuranceSum(items)).toBe(2000);
    expect(cap(items)).toBe(4000);
  });
  it("policy covers sword + amulet -> insurance sum 1600, cap 3200", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    expect(insuranceSum(items)).toBe(1600);
    expect(cap(items)).toBe(3200);
  });
  it("cursed sword (premium 165) -> cap 2000 (based on unmodified insurance value)", () => {
    const items = [{ type: "sword", cursed: true }];
    expect(cap(items)).toBe(2000);
  });
  it("policy covers sword + 3 runes block -> insurance sum 1750 (block only affects premium)", () => {
    const items = [
      { type: "sword" },
      { type: "rune" }, { type: "rune" }, { type: "rune" },
    ];
    expect(insuranceSum(items)).toBe(1750);
  });

  // Multiple items of same type
  it("two swords, dragon attack damages both -> each damage own deductible", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const result = claim(
      items,
      [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
      4000
    );
    expect(result.payout).toBe(800);
  });

  // Cap exhaustion across successive claims
  it("sword (cap 2000), two claims of 1500 each -> first payout 1400 (cap rem 600), second payout 600 (cap rem 0)", () => {
    const items = [{ type: "sword" }];
    const first = claim(items, [{ itemType: "sword", amount: 1500 }], 2000);
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    const second = claim(items, [{ itemType: "sword", amount: 1500 }], first.remainingCap);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });

  // Payout rounding
  it("payout calculation yielding 350.5 -> final payout 350 (rounded down)", () => {
    // ench 8 sword, damage 901: 450.5 (50%) - 100 deductible = 350.5 -> floor 350
    const items = [{ type: "sword", enchantment: 8 }];
    const result = claim(items, [{ itemType: "sword", amount: 901 }], 2000);
    expect(result.payout).toBe(350);
  });
});

describe("MHPCO Claim Office - CLI / errors", () => {
  it("quote with unknown item type -> non-zero exit, error to stderr, no results", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });
  it("claim references item not in policy -> non-zero exit, error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim with more damages of a type than covered -> non-zero exit, claim rejected", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("claim with negative amount -> non-zero exit, error to stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
  });
  it("CLI reads JSON scenario from stdin and writes results JSON to stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.status).toBe(0);
    const parsed = JSON.parse(result.stdout);
    // amulet: 60 base - 12 loyalty + 6 first + 5 fee = 59
    expect(parsed.results[0]).toEqual({ premium: 59 });
    // amulet claim 200: 100 payout; cap 1200 -> remaining 1100
    expect(parsed.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
