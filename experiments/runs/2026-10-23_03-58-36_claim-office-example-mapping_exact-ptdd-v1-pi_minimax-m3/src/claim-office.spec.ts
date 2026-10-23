import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import {
  calculateBasePremium,
  calculateInsuranceSum,
  createPolicy,
} from "./policy.js";
import { calculatePremium } from "./premium.js";
import { calculateClaimPayout } from "./claim.js";
import { runScenario } from "./scenario.js";
import type {
  Customer,
  DamageEntry,
  Policy,
  QuoteItem,
  Scenario,
} from "./domain.js";

const newcomer: Customer = { yearsWithMHPCO: 0 };

// ---------------------------------------------------------------------------
// Quote - empty list and simple main items
// ---------------------------------------------------------------------------

describe("Quote - empty and simple main items", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    expect(calculatePremium([], newcomer, false)).toBe(5);
  });

  it("single sword (newcomer) -> premium 115 G (100 + 10 first insurance + 5 fee)", () => {
    expect(calculatePremium([{ type: "sword" }], newcomer, false)).toBe(115);
  });

  it("single amulet (newcomer) -> premium 71 G (60 + 6 + 5)", () => {
    expect(calculatePremium([{ type: "amulet" }], newcomer, false)).toBe(71);
  });

  it("single staff (newcomer) -> premium 93 G (80 + 8 + 5)", () => {
    expect(calculatePremium([{ type: "staff" }], newcomer, false)).toBe(93);
  });

  it("single potion (newcomer) -> premium 49 G (40 + 4 + 5)", () => {
    expect(calculatePremium([{ type: "potion" }], newcomer, false)).toBe(49);
  });

  it(
    "sword + amulet (newcomer) -> premium 181 G (160 base + 16 first insurance + 5 fee)",
    () => {
      expect(
        calculatePremium([{ type: "sword" }, { type: "amulet" }], newcomer, false),
      ).toBe(181);
    },
  );
});

// ---------------------------------------------------------------------------
// Quote - components and building blocks (testing the block rule in isolation)
// ---------------------------------------------------------------------------

describe("Quote - components and blocks (base premium only)", () => {
  it("2 runes -> base premium 50 G (no block)", () => {
    expect(
      calculateBasePremium([{ type: "rune" }, { type: "rune" }]),
    ).toBe(50);
  });

  it("3 runes -> base premium 60 G (block applies)", () => {
    expect(
      calculateBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(60);
  });

  it("4 runes -> base premium 100 G (no block, block requires exactly 3)", () => {
    expect(
      calculateBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });

  it("7 runes -> base premium 175 G (no block, count is not 3)", () => {
    expect(
      calculateBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(175);
  });

  it(
    "2 runes + 1 moonstone -> base premium 75 G (no block: different types)",
    () => {
      expect(
        calculateBasePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ]),
      ).toBe(75);
    },
  );

  it(
    "3 runes + 3 moonstones -> base premium 120 G (two separate blocks)",
    () => {
      expect(
        calculateBasePremium([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ]),
      ).toBe(120);
    },
  );
});

// ---------------------------------------------------------------------------
// Quote - item-specific modifiers
// ---------------------------------------------------------------------------

describe("Quote - item-specific modifiers (cursed, high enchantment)", () => {
  it("cursed sword (newcomer) -> premium 165 G", () => {
    expect(
      calculatePremium([{ type: "sword", cursed: true }], newcomer, false),
    ).toBe(165);
  });

  it("sword with enchantment 5 (newcomer) -> premium 145 G", () => {
    expect(
      calculatePremium([{ type: "sword", enchantment: 5 }], newcomer, false),
    ).toBe(145);
  });

  it(
    "sword with enchantment 4 (newcomer) -> premium 115 G (no high-enchantment surcharge)",
    () => {
      expect(
        calculatePremium(
          [{ type: "sword", enchantment: 4 }],
          newcomer,
          false,
        ),
      ).toBe(115);
    },
  );

  it(
    "cursed sword with enchantment 5 (newcomer) -> premium 195 G (both surcharges)",
    () => {
      expect(
        calculatePremium(
          [{ type: "sword", cursed: true, enchantment: 5 }],
          newcomer,
          false,
        ),
      ).toBe(195);
    },
  );

  it(
    "cursed sword + plain amulet (newcomer) -> premium 231 G (cursed surcharge on sword base, not policy base)",
    () => {
      expect(
        calculatePremium(
          [{ type: "sword", cursed: true }, { type: "amulet" }],
          newcomer,
          false,
        ),
      ).toBe(231);
    },
  );
});

// ---------------------------------------------------------------------------
// Quote - policy-wide modifiers
// ---------------------------------------------------------------------------

describe("Quote - policy-wide modifiers (loyalty, first insurance, follow-up)", () => {
  it(
    "customer with exactly 2 years -> loyalty discount applies (sword: premium 95 G)",
    () => {
      expect(
        calculatePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 2 },
          false,
        ),
      ).toBe(95);
    },
  );

  it(
    "customer with 1 year -> loyalty discount does not apply (sword: premium 115 G)",
    () => {
      expect(
        calculatePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 1 },
          false,
        ),
      ).toBe(115);
    },
  );

  it(
    "first insurance surcharge always applies, even for a long-standing customer's first sword",
    () => {
      // 3-year customer, second contract, plain sword.
      // base 100 + first insurance 10 - loyalty 20 - follow-up 15 + fee 5 = 80
      expect(
        calculatePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 3 },
          true,
        ),
      ).toBe(80);
    },
  );

  it(
    "second contract (follow-up) -> 15% discount applies (newcomer 2nd contract, sword: premium 100 G)",
    () => {
      expect(
        calculatePremium(
          [{ type: "sword" }],
          { yearsWithMHPCO: 0 },
          true,
        ),
      ).toBe(100);
    },
  );

  it(
    "loyalty + first insurance + follow-up stack (3-year customer, 2nd contract, sword: premium 80 G)",
    () => {
      // First contract: same customer with sword -> premium 95 (no follow-up yet).
      // Second contract: follow-up applies, full stacking -> premium 80.
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      };
      const { results } = runScenario(scenario);
      expect(results[0]).toEqual({ premium: 95 });
      expect(results[1]).toEqual({ premium: 80 });
    },
  );
});

// ---------------------------------------------------------------------------
// Quote - integration examples from the spec
// ---------------------------------------------------------------------------

describe("Quote - integration examples", () => {
  it("newcomer (0 years) with cursed sword -> premium 165 G", () => {
    expect(
      calculatePremium([{ type: "sword", cursed: true }], newcomer, false),
    ).toBe(165);
  });

  it(
    "long-standing customer's second contract (3 years, cursed sword enchantment 7) -> premium 160 G",
    () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          // First contract (any sword): sets up contract count.
          { op: "quote", items: [{ type: "sword" }] },
          // Second contract: the cursed, high-enchantment sword from the spec example.
          {
            op: "quote",
            items: [{ type: "sword", cursed: true, enchantment: 7 }],
          },
        ],
      };
      const { results } = runScenario(scenario);
      expect(results[1]).toEqual({ premium: 160 });
    },
  );
});

// ---------------------------------------------------------------------------
// Quote - rounding
// ---------------------------------------------------------------------------

describe("Quote - rounding in MHPCO's favor", () => {
  it(
    "7 runes (newcomer): raw 197.5 G, rounded up to 198 G (intermediate amounts stay as fractions)",
    () => {
      const items: QuoteItem[] = Array.from({ length: 7 }, () => ({
        type: "rune",
      }));
      expect(calculatePremium(items, newcomer, false)).toBe(198);
    },
  );
});

// ---------------------------------------------------------------------------
// Quote - errors
// ---------------------------------------------------------------------------

describe("Quote - error cases", () => {
  it("unknown item type in quote -> throws / rejects", () => {
    expect(() =>
      calculatePremium([{ type: "broomstick" as never }], newcomer, false),
    ).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Claim - standard reimbursement (no special clauses)
// ---------------------------------------------------------------------------

describe("Claim - standard reimbursement", () => {
  it(
    "regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (full - deductible)",
    () => {
      const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
      const damages: DamageEntry[] = [{ itemType: "sword", amount: 500 }];
      const { payout, remainingCap } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(400);
      expect(remainingCap).toBe(1600);
    },
  );

  it(
    "damage to a rune (insurance value 250 G), damage 200 G -> payout 100 G",
    () => {
      const policy = createPolicy([{ type: "rune" }]);
      const damages: DamageEntry[] = [{ itemType: "rune", amount: 200 }];
      const { payout, remainingCap } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(100);
      expect(remainingCap).toBe(400);
    },
  );
});

// ---------------------------------------------------------------------------
// Claim - high enchantment (>= 8)
// ---------------------------------------------------------------------------

describe("Claim - high enchantment (>= 8)", () => {
  it(
    "steel sword enchantment 8 (boundary) damage 1000 G -> payout 400 G (50% then deductible)",
    () => {
      const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 8 }]);
      const damages: DamageEntry[] = [{ itemType: "sword", amount: 1000 }];
      const { payout } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(400);
    },
  );

  it(
    "steel sword enchantment 9 damage 1000 G -> payout 400 G (50% then deductible)",
    () => {
      const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
      const damages: DamageEntry[] = [{ itemType: "sword", amount: 1000 }];
      const { payout } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(400);
    },
  );
});

// ---------------------------------------------------------------------------
// Claim - dragon material (full reimbursement)
// ---------------------------------------------------------------------------

describe("Claim - dragon material", () => {
  it(
    "dragon-material sword enchantment 5 damage 800 G -> payout 700 G (full then deductible)",
    () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 5 },
      ]);
      const damages: DamageEntry[] = [{ itemType: "sword", amount: 800 }];
      const { payout } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(700);
    },
  );
});

// ---------------------------------------------------------------------------
// Claim - enchantment vs dragon material (50% wins when both apply)
// ---------------------------------------------------------------------------

describe("Claim - enchantment vs dragon material", () => {
  it(
    "dragon-material sword enchantment 8 damage 1000 G -> payout 400 G (50% rule wins)",
    () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 8 },
      ]);
      const damages: DamageEntry[] = [{ itemType: "sword", amount: 1000 }];
      const { payout } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(400);
    },
  );

  it(
    "dragon-material sword enchantment 9 damage 1000 G -> payout 400 G (50% rule wins)",
    () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 9 },
      ]);
      const damages: DamageEntry[] = [{ itemType: "sword", amount: 1000 }];
      const { payout } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(400);
    },
  );
});

// ---------------------------------------------------------------------------
// Claim - deductible per damage event
// ---------------------------------------------------------------------------

describe("Claim - deductible per damage event", () => {
  it(
    "dragon attack damages an insured sword (500 G) and an insured amulet (300 G) -> payout 600 G (per-event deductible)",
    () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon" },
        { type: "amulet", material: "dragon" },
      ]);
      const damages: DamageEntry[] = [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ];
      const { payout } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(600);
    },
  );
});

// ---------------------------------------------------------------------------
// Claim - insurance sum and cap
// ---------------------------------------------------------------------------

describe("Claim - insurance sum and cap", () => {
  it("sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.cap).toBe(3200);
  });

  it(
    "cursed sword (insurance value 1000 G) -> cap 2000 G (cap based on insurance value, not premium)",
    () => {
      const policy = createPolicy([{ type: "sword", cursed: true }]);
      expect(policy.insuranceSum).toBe(1000);
      expect(policy.cap).toBe(2000);
    },
  );

  it(
    "sword + 3 runes (block) -> insurance sum 1750 G (block discount affects premium only)",
    () => {
      const policy = createPolicy([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]);
      expect(policy.insuranceSum).toBe(1750);
      expect(policy.cap).toBe(3500);
    },
  );

  it("two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const policy = createPolicy([{ type: "sword" }, { type: "sword" }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
  });
});

// ---------------------------------------------------------------------------
// Claim - cap exhaustion across successive claims
// ---------------------------------------------------------------------------

describe("Claim - cap exhaustion", () => {
  it(
    "two successive claims of 1500 G against a sword (cap 2000) -> first payout 1400, cap remaining 600; second payout 600, cap remaining 0",
    () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      };
      const { results } = runScenario(scenario);
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    },
  );
});

// ---------------------------------------------------------------------------
// Claim - multiple items of the same type
// ---------------------------------------------------------------------------

describe("Claim - multiple items of the same type", () => {
  it("two swords damaged; each damage entry has its own deductible", () => {
    const policy = createPolicy([
      { type: "sword", material: "dragon" },
      { type: "sword", material: "dragon" },
    ]);
    const damages: DamageEntry[] = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 500 },
    ];
    const { payout } = calculateClaimPayout(policy, damages);
    expect(payout).toBe(800);
  });

  it(
    "two sword damages but only one sword insured -> whole claim rejected",
    () => {
      const policy = createPolicy([{ type: "sword" }]);
      const damages: DamageEntry[] = [
        { itemType: "sword", amount: 100 },
        { itemType: "sword", amount: 100 },
      ];
      expect(() => calculateClaimPayout(policy, damages)).toThrow();
    },
  );
});

// ---------------------------------------------------------------------------
// Claim - rounding
// ---------------------------------------------------------------------------

describe("Claim - rounding in MHPCO's favor", () => {
  it(
    "steel sword enchantment 9, damage 901 G -> raw 350.5 G, final payout 350 G (round down)",
    () => {
      const policy = createPolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
      const damages: DamageEntry[] = [{ itemType: "sword", amount: 901 }];
      const { payout } = calculateClaimPayout(policy, damages);
      expect(payout).toBe(350);
    },
  );
});

// ---------------------------------------------------------------------------
// Claim - errors
// ---------------------------------------------------------------------------

describe("Claim - error cases", () => {
  it("damage entry for an item not in the policy -> rejects", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const damages: DamageEntry[] = [{ itemType: "amulet", amount: 100 }];
    expect(() => calculateClaimPayout(policy, damages)).toThrow();
  });

  it("unknown item type in damage entry -> rejects", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const damages: DamageEntry[] = [{ itemType: "broomstick" as never, amount: 100 }];
    expect(() => calculateClaimPayout(policy, damages)).toThrow();
  });

  it("damage entry with amount: -200 -> rejects", () => {
    const policy = createPolicy([{ type: "sword" }]);
    const damages: DamageEntry[] = [{ itemType: "sword", amount: -200 }];
    expect(() => calculateClaimPayout(policy, damages)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Scenario - multi-step
// ---------------------------------------------------------------------------

describe("Scenario - multi-step", () => {
  it("quote then claim: standard reimbursement scenario end-to-end", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2 }],
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
    };
    const { results } = runScenario(scenario);
    // amulet: 60 base - 12 loyalty (5yr >= 2) + 6 first insurance + 5 fee = 59
    // claim: 200 - 100 deductible = 100, cap 1200 -> remainingCap 1100
    expect(results[0]).toEqual({ premium: 59 });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it("multiple sequential claims share the policy cap", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[1]).toEqual({ payout: 400, remainingCap: 2800 });
    expect(results[2]).toEqual({ payout: 200, remainingCap: 2600 });
  });
});

// ---------------------------------------------------------------------------
// CLI - stdin/stdout + error contract
// ---------------------------------------------------------------------------

describe("CLI", () => {
  it("reads JSON from stdin, writes JSON results to stdout", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    const cliPath = new URL("./cli.ts", import.meta.url).pathname;
    const result = spawnSync("node", ["--import", "tsx", cliPath], {
      input,
      encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    const out = JSON.parse(result.stdout);
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  it(
    "on error: exits non-zero, writes error description to stderr, no results on stdout",
    () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      const cliPath = new URL("./cli.ts", import.meta.url).pathname;
      const result = spawnSync("node", ["--import", "tsx", cliPath], {
        input,
        encoding: "utf8",
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
      expect(result.stdout).toBe("");
    },
  );
});
