import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { quote } from "./quote.js";
import { claim } from "./claim.js";

const cliPath = join(process.cwd(), "src/cli.ts");

interface CliRunResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(input: object): CliRunResult {
  const result = spawnSync("node", ["--import", "tsx", cliPath], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

describe("quote - empty", () => {
  it("empty item list returns only the processing fee (5 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });
});

describe("quote - single items (base premiums)", () => {
  it("single rune: base 25 G + 5 fee = 30 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(30);
  });
  it("single moonstone: base 25 G + 5 fee = 30 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(30);
  });
  it("single sword: base 100 G + 5 fee = 105 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(105);
  });
  it("single amulet: base 60 G + 5 fee = 65 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(65);
  });
  it.todo("single staff: base 80 G + 5 fee = 85 G");
  it.todo("single potion: base 40 G + 5 fee = 45 G");
});

describe("quote - components and blocks", () => {
  it.todo("2 runes: 50 G base + 5 fee = 55 G (no block)");
  it.todo("3 runes: 60 G base + 5 fee = 65 G (block applies)");
  it.todo("4 runes: 100 G base + 5 fee = 105 G (no block, requires exactly 3)");
  it.todo("7 runes: 175 G base + 5 fee = 180 G (no block)");
  it.todo("2 runes + 1 moonstone: 75 G base + 5 fee = 80 G (no block, different types)");
  it.todo("3 runes + 3 moonstones: 120 G base + 5 fee = 125 G (two separate blocks)");
});

describe("quote - item-specific modifiers", () => {
  it.todo("cursed sword (steel, enchantment 3, first contract, 0 years): 165 G");
  it.todo("cursed sword with enchantment 5 (first contract, 0 years): 195 G (curse + high enchant)");
  it.todo("cursed sword with enchantment 4 (first contract, 0 years): 165 G (no high enchant)");
  it.todo("sword with enchantment 5 (not cursed, first contract, 0 years): 145 G");
  it.todo("cursed sword + plain amulet (first contract, 0 years): 231 G (210 + 16 + 5)");
});

describe("quote - policy-wide modifiers", () => {
  it.todo("loyalty discount: sword with exactly 2 years, first contract: 95 G");
  it.todo("loyalty applies to amulet too: amulet with 2 years, first contract: 59 G");
  it.todo("follow-up contract: sword with 1 year, second quote: 100 G");
  it.todo("loyalty + follow-up: sword with 2+ years, second quote: 80 G");
});

describe("quote - integration scenarios", () => {
  it.todo("newcomer with cursed sword (steel, enchantment 3): 165 G");
  it.todo(
    "long-standing customer's second contract with cursed sword (steel, enchantment 7): 160 G",
  );
});

describe("quote - rounding", () => {
  it.todo(
    "premium rounded up: 2 cursed runes, 3 years, 2nd quote -> 67.5 G -> 68 G",
  );
});

describe("quote - errors", () => {
  it.todo("throws when item type is unknown (e.g. broomstick)");
});

describe("claim - standard reimbursement", () => {
  it.todo("regular sword (steel, enchantment 3), damage 500 -> payout 400 G");
  it.todo("rune damage 200 -> payout 100 G (no special clauses)");
});

describe("claim - special clauses", () => {
  it.todo("dragon sword (enchantment 5), damage 800 -> payout 700 G (full reimbursement)");
  it.todo("dragon sword (enchantment 8), damage 1000 -> payout 400 G (50% wins over dragon)");
  it.todo("dragon sword (enchantment 9), damage 1000 -> payout 400 G");
  it.todo("steel sword (enchantment 9), damage 1000 -> payout 400 G (50% rule)");
});

describe("claim - deductible per damage event", () => {
  it.todo(
    "dragon attack damages sword 500 + amulet 300 -> payout 600 G (deductible per item)",
  );
  it.todo(
    "two sword damages in one claim -> each entry treated as a separate damage with its own deductible",
  );
});

describe("claim - insurance sum and cap", () => {
  it.todo("sword + amulet insurance sum 1600, cap 3200 G");
  it.todo(
    "sword + 3 runes (block) insurance sum 1750 G, cap 3500 G (block does not affect insurance)",
  );
  it.todo(
    "cursed sword premium does not raise cap (cap based on unmodified insurance value)",
  );
});

describe("claim - cap exhaustion", () => {
  it.todo(
    "sword with two successive claims of 1500 -> 1400 + 600, remainingCap 600 then 0",
  );
});

describe("claim - rounding", () => {
  it.todo(
    "payout rounded down: damage 901 to dragon sword enchant 8 -> 350.5 G -> 350 G",
  );
});

describe("claim - errors", () => {
  it.todo("throws when damage amount is negative");
  it.todo("throws when damage references item not on policy");
  it.todo("throws when unknown item type appears in damage");
  it.todo("throws when damages exceed policy coverage for a given type");
});

describe("cli", () => {
  it.todo("reads JSON scenario from stdin and writes results to stdout");
  it.todo(
    "quote with unknown item type -> exit non-zero, error to stderr, no results on stdout",
  );
  it.todo("claim referencing item not on policy -> exit non-zero");
  it.todo("negative damage amount -> exit non-zero");
  it.todo("damages more entries than policy covers -> exit non-zero");
});
