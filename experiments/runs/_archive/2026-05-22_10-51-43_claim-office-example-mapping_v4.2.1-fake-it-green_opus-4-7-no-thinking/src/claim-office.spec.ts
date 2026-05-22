import { describe, it, expect } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { quote, claim } from "./claim-office.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(scenario: unknown): { stdout: string } {
  const stdout = execFileSync("tsx", [CLI_PATH], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { stdout };
}

function runCliExpectingFailure(scenario: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("tsx", [CLI_PATH], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("MHPCO Claim Office", () => {
  describe("quote — single item base premiums (R1)", () => {
    it("amulet alone → base premium 60 G (before fee, no other modifiers)", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], { followUp: false });
      expect(result.basePremium).toBe(60);
    });
    it("sword alone → base premium 100 G", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], { followUp: false });
      expect(result.basePremium).toBe(100);
    });
    it("staff alone → base premium 80 G", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], { followUp: false });
      expect(result.basePremium).toBe(80);
    });
    it("potion alone → base premium 40 G", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], { followUp: false });
      expect(result.basePremium).toBe(40);
    });
    it("a single rune → base premium 25 G", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], { followUp: false });
      expect(result.basePremium).toBe(25);
    });
    it("empty item list → premium 5 G (processing fee only)", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [], { followUp: false });
      expect(result.premium).toBe(5);
    });
  });

  describe("quote — component building blocks (R2, R3)", () => {
    it("2 runes → base premium 50 G (below block size, 2×25)", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], { followUp: false });
      expect(result.basePremium).toBe(50);
    });
    it("3 runes → base premium 60 G (block of exactly 3 applies)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        { followUp: false },
      );
      expect(result.basePremium).toBe(60);
    });
    it("4 runes → base premium 100 G (no block — block requires exactly 3, 4×25)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        { followUp: false },
      );
      expect(result.basePremium).toBe(100);
    });
    it("7 runes → base premium 175 G (no block — 7×25)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        { followUp: false },
      );
      expect(result.basePremium).toBe(175);
    });
    it("2 runes + 1 moonstone → base premium 75 G (no block: different types, 3×25)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        { followUp: false },
      );
      expect(result.basePremium).toBe(75);
    });
    it("3 runes + 3 moonstones → base premium 120 G (two separate blocks, 60 + 60)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
        { followUp: false },
      );
      expect(result.basePremium).toBe(120);
    });
  });

  describe("quote — premium modifiers and scope (R4, R5)", () => {
    it("cursed sword adds 50% to the item base premium → 150 G base+surcharge (before policy modifiers and fee)", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], { followUp: false });
      expect(result.basePremium).toBe(150);
    });
    it("sword with enchantment exactly 5 → high-enchantment 30% surcharge applies", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], { followUp: false });
      expect(result.basePremium).toBe(130);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], { followUp: false });
      expect(result.basePremium).toBe(100);
    });
    it("customer with exactly 2 years → 20% loyalty discount applies", () => {
      const result = quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], { followUp: false });
      expect(result.premium).toBe(95);
    });
    it("policy with cursed sword (100) + plain amulet (60) → 210 G before policy-wide modifiers and fee (cursed surcharge 50 = 50% of sword base only)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", cursed: true }, { type: "amulet" }],
        { followUp: false },
      );
      expect(result.basePremium).toBe(210);
    });
  });

  describe("quote — integration examples (R4, R5, R8)", () => {
    it("newcomer (0 yrs), cursed sword (steel, ench 3) → premium 165 G (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
      const result = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        { followUp: false },
      );
      expect(result.premium).toBe(165);
    });
    it("long-standing customer (3 yrs), second quote, cursed sword (steel, ench 7) → premium 160 G (100 + 50 curse + 30 high-ench − 20 loyalty + 10 first-ins − 15 follow-up + 5 fee)", () => {
      const result = quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        { followUp: true },
      );
      expect(result.premium).toBe(160);
    });
    it("premium that computes to 197.5 G → rounded up to 198 G (MHPCO favor)", () => {
      const result = quote(
        { yearsWithMHPCO: 2 },
        [{ type: "sword", cursed: true, enchantment: 5 }, { type: "rune" }],
        { followUp: false },
      );
      expect(result.premium).toBe(198);
    });
  });

  describe("claim — standard reimbursement and clauses (R7)", () => {
    it("regular sword (steel, ench 3), damage 500 G → payout 400 G (500 − 100 deductible)", () => {
      const policy = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", material: "steel", enchantment: 3 }], {
        followUp: false,
      });
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 500 }],
      });
      expect(result.payout).toBe(400);
    });
    it("rune (insurance value 250 G), damage 200 G → payout 100 G (200 − 100, no special clause)", () => {
      const policy = quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], { followUp: false });
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "rune", amount: 200 }],
      });
      expect(result.payout).toBe(100);
    });
    it("dragon-material sword, enchantment exactly 8, damage 1000 G → payout 400 G (50% clause then deductible: 500 − 100)", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      expect(result.payout).toBe(400);
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon full reimbursement then deductible: 800 − 100)", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 800 }],
      });
      expect(result.payout).toBe(700);
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (high-ench 50% then deductible: 500 − 100)", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 9 }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      expect(result.payout).toBe(400);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% rule wins over dragon, then deductible)", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      expect(result.payout).toBe(400);
    });
    it("dragon attack: sword damaged 500 G + amulet damaged 300 G → payout 600 G (100 G deductible per damaged item)", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword" }, { type: "amulet" }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      });
      expect(result.payout).toBe(600);
    });
    it("payout that computes to 350.5 G → rounded down to 350 G (MHPCO favor)", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 8 }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 901 }],
      });
      expect(result.payout).toBe(350);
    });
  });

  describe("claim — caps and exhaustion (R7)", () => {
    it("sword + amulet → insurance sum 1600 G, cap 3200 G (2× sum of insurance values)", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword" }, { type: "amulet" }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 200 }],
      });
      expect(result.remainingCap).toBe(3200 - 100);
    });
    it("cursed sword (value 1000, premium 165) → cap 2000 G (based on unmodified insurance value)", () => {
      const policy = quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], { followUp: false });
      expect(policy.premium).toBe(165);
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 300 }],
      });
      expect(result.remainingCap).toBe(2000 - 200);
    });
    it("sword + 3 runes (block) → insurance sum 1750 G (1000 + 3×250; block discount affects premium only)", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 200 }],
      });
      expect(result.remainingCap).toBe(3500 - 100);
    });
    it("sword (cap 2000), two successive 1500 G claims → first payout 1400 G (remaining cap 600), second payout 600 G (remaining cap 0)", () => {
      const policy = quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], { followUp: false });
      const first = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 1500 }],
      });
      expect(first.payout).toBe(1400);
      expect(first.remainingCap).toBe(600);
      const second = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 1500 }],
      });
      expect(second.payout).toBe(600);
      expect(second.remainingCap).toBe(0);
    });
    it("two swords → insurance sum 2000 G, cap 4000 G", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword" }, { type: "sword" }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "accident",
        damages: [{ itemType: "sword", amount: 200 }],
      });
      expect(result.remainingCap).toBe(4000 - 100);
    });
    it("two swords both damaged (two sword damage entries) → each treated as separate damage with its own 100 G deductible", () => {
      const policy = quote(
        { yearsWithMHPCO: 0 },
        [{ type: "sword" }, { type: "sword" }],
        { followUp: false },
      );
      const result = claim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      });
      expect(result.payout).toBe(800);
    });
  });
});

describe("MHPCO Claim Office — CLI (src/cli.ts via stdin/stdout)", () => {
  it("CLI reads a JSON scenario from stdin and writes {results:[...]} with a premium integer for a quote step", () => {
    const { stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    const output = JSON.parse(stdout);
    expect(output.results[0].premium).toBe(59);
  });
  it("CLI writes payout and remainingCap integers for a claim step result, in step order", () => {
    const { stdout } = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    const output = JSON.parse(stdout);
    expect(output.results).toHaveLength(2);
    expect(output.results[0].premium).toBe(59);
    expect(output.results[1].payout).toBe(100);
    expect(output.results[1].remainingCap).toBe(1100);
  });
  it("CLI exits with non-zero status and writes error to stderr (no results on stdout) when a quote item has an unknown type (e.g. broomstick)", () => {
    const { status, stdout, stderr } = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    let parsed: unknown;
    try {
      parsed = JSON.parse(stdout);
    } catch {
      parsed = undefined;
    }
    const results =
      parsed !== null && typeof parsed === "object"
        ? (parsed as { results?: unknown }).results
        : undefined;
    expect(results === undefined || (Array.isArray(results) && results.length === 0)).toBe(true);
  });
  it("CLI exits with non-zero status when a claim references an item not in the policy (e.g. amulet damaged when only a sword is insured)", () => {
    const { status, stderr } = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
  it("CLI exits with non-zero status when a damage entry has a negative amount (e.g. -200)", () => {
    const { status, stderr } = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
  it("CLI exits with non-zero status when damages contain more entries of a type than the policy covers (two sword damages, one sword insured)", () => {
    const { status, stderr } = runCliExpectingFailure({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "x",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "sword", amount: 200 },
            ],
          },
        },
      ],
    });
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
