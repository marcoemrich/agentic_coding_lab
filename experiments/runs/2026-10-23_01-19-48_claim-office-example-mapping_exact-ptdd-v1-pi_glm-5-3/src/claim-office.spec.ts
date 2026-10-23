import { describe, expect, it } from "vitest";
import { runScenario, type Scenario } from "./scenario.js";
import { spawnCLI } from "./test-cli-helper.js";

const scenario = (steps: Array<Record<string, unknown>>): Scenario =>
  ({ customer: { yearsWithMHPCO: 0 }, steps }) as Scenario;

const claimStep = (policy: number, damages: Array<Record<string, unknown>>) => ({
  op: "claim",
  policy,
  incident: { cause: "fire", damages },
});

describe("MHPCO Claim Office", () => {
  it("premium: empty item list -> 5 G (only the processing fee)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [] }]));
    expect(results).toEqual([{ premium: 5 }]);
  });

  // ---- Quote: item values and base premiums (simplest cases first) ----
  it("premium: single plain sword, first insurance -> 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [{ type: "sword" }] }]));
    expect(results).toEqual([{ premium: 115 }]);
  });

  it("premium: single plain amulet, first insurance -> 71 G (60 base + 6 + 5 fee)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [{ type: "amulet" }] }]));
    expect(results).toEqual([{ premium: 71 }]);
  });

  it("premium: single plain staff, first insurance -> 93 G (80 base + 8 + 5 fee)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [{ type: "staff" }] }]));
    expect(results).toEqual([{ premium: 93 }]);
  });

  it("premium: single plain potion, first insurance -> 49 G (40 base + 4 + 5 fee)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [{ type: "potion" }] }]));
    expect(results).toEqual([{ premium: 49 }]);
  });

  it("premium: single rune component, first insurance -> 33 G (25 base + 2.5 + 5 fee)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [{ type: "rune" }] }]));
    expect(results).toEqual([{ premium: 33 }]);
  });

  it("premium: single moonstone component, first insurance -> 33 G (25 base + 2.5 + 5 fee)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [{ type: "moonstone" }] }]));
    expect(results).toEqual([{ premium: 33 }]);
  });


  // ---- Quote: building block of 3 alike components ----
  it("premium: 2 runes -> 50 G base premium; first insurance -> 60 G total (55 + 5 fee)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]));
    expect(results).toEqual([{ premium: 60 }]);
  });

  it("premium: 3 runes -> 60 G base premium (block applies: 66 + 5 fee = 71 G total with first insurance)", () => {
    const results = runScenario(
      scenario([{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]),
    );
    expect(results).toEqual([{ premium: 71 }]);
  });

  it("premium: 4 runes -> 100 G base premium (no block -- block requires exactly 3; 110 + 5 fee = 115 G total)", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ]),
    );
    expect(results).toEqual([{ premium: 115 }]);
  });

  it("premium: 7 runes -> 175 G base premium (two blocks 60+60 + one single 25; 192.5 + 5 fee = 198 G total, the spec's rounding example)", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ]),
    );
    expect(results).toEqual([{ premium: 198 }]);
  });

  it("premium: 2 runes + 1 moonstone -> 75 G base premium (no block: different types; 82.5 + 5 fee = 88 G total)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ]),
    );
    expect(results).toEqual([{ premium: 88 }]);
  });

  it("premium: 3 runes + 3 moonstones -> 120 G base premium (two separate blocks; 132 + 5 fee = 137 G total)", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ]),
    );
    expect(results).toEqual([{ premium: 137 }]);
  });


  // ---- Quote: premium modifiers in isolation ----
  it("premium: cursed sword, first insurance -> 165 G (100 + 50 curse + 10 first insurance + 5 fee, per integration example)", () => {
    const results = runScenario(
      scenario([{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }]),
    );
    expect(results).toEqual([{ premium: 165 }]);
  });

  it("premium: sword with enchantment level exactly 5, first insurance -> 145 G (100 + 30 high enchantment + 10 + 5 fee)", () => {
    const results = runScenario(
      scenario([{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]),
    );
    expect(results).toEqual([{ premium: 145 }]);
  });

  it("premium: sword with enchantment level 4, first insurance -> 115 G (no high-enchantment surcharge)", () => {
    const results = runScenario(
      scenario([{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }]),
    );
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("premium: customer with exactly 2 years with MHPCO -> loyalty discount applies (amulet 60 base -> 60+6-12=54 + 5 fee = 59 G)", () => {
    const loyal = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] } as Scenario;
    const results = runScenario(loyal);
    expect(results).toEqual([{ premium: 59 }]);
  });

  it("premium: first insurance carries a 10 % initial assessment surcharge (plain sword, first contract -> 110 + 5 fee = 115 G)", () => {
    const results = runScenario(scenario([{ op: "quote", items: [{ type: "sword" }] }]));
    expect(results).toEqual([{ premium: 115 }]);
  });

  it("premium: follow-up contract gets 15 % discount on policy base premium (second quote of a plain sword -> 100 - 15 + 10 + 5 fee = 100 G; first stays 115)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ]),
    );
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });

  // ---- Quote: modifier scope on multi-item policies (? cursed scope) ----
  it("premium: cursed sword + plain amulet -> 210 G before further modifiers (curse on the item only); first insurance + 16 + 5 fee = 231 G total", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ]),
    );
    expect(results).toEqual([{ premium: 231 }]);
  });

  // ---- Quote: integration examples ----
  it("integration: newcomer (0 years, first contract) with cursed sword (steel, enchantment 3) -> 165 G", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ]),
    );
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("integration: long-standing customer's second contract, cursed sword enchantment 7 -> 160 G (100 + 50 + 30 - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
    const longstanding = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    } as Scenario;
    const results = runScenario(longstanding);
    expect(results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it("first insurance applies per item regardless of customer history (long-standing customer, brand-new sword, first quote -> 100 + 10 - 20 + 5 = 95 G)", () => {
    const longstanding = {
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    } as Scenario;
    const results = runScenario(longstanding);
    expect(results).toEqual([{ premium: 95 }]);
  });

  // ---- Quote: rounding ----
  it("premium: final amount rounds up in MHPCO's favor (7 runes yield 197.5 -> 198 G)", () => {
    const results = runScenario(
      scenario([{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }]),
    );
    expect(results).toEqual([{ premium: 198 }]);
  });
  it("premium: intermediate amounts stay fractional; only the final total rounds (2 runes + 1 moonstone: 75 base, 82.5 + 5 = 87.5 -> 88 G, not 82 + 5 = 87)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ]),
    );
    expect(results).toEqual([{ premium: 88 }]);
  });

  // ---- Quote: cap bookkeeping values ----
  it("quote: sword + amulet -> insurance sum 1600 G, cap 3200 G (amulet damage 300 -> payout 200, remainingCap 3000)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        claimStep(0, [{ itemType: "amulet", amount: 300 }]),
      ]),
    );
    expect(results).toEqual([{ premium: 181 }, { payout: 200, remainingCap: 3000 }]);
  });
  it("quote: two swords -> insurance sum 2000 G, cap 4000 G (two damages of 500 -> payout 800, remainingCap 3200)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        claimStep(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ]),
    );
    expect(results).toEqual([{ premium: 225 }, { payout: 800, remainingCap: 3200 }]);
  });
  it("quote: cursed sword -> cap 2000 G, premium modifiers do not raise the cap (damage 1000 -> payout 900, remainingCap 1100)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        claimStep(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(results).toEqual([{ premium: 165 }, { payout: 900, remainingCap: 1100 }]);
  });
  it("quote: sword + 3 runes (block) -> insurance sum 1750 G, cap 3500 (block affects premium only; damages 1000 + 250 -> payout 1050, remainingCap 2450; premium 181)", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
        claimStep(0, [
          { itemType: "sword", amount: 1000 },
          { itemType: "rune", amount: 250 },
        ]),
      ]),
    );
    expect(results).toEqual([{ premium: 181 }, { payout: 1050, remainingCap: 2450 }]);
  });

  // ---- Claim: standard reimbursement and deductible ----
  it("claim: regular sword (steel, enchantment 3), damage 500 -> payout 400, remainingCap 1600", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        claimStep(0, [{ itemType: "sword", amount: 500 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon attack damages sword (500) and amulet (300) -> payout 600 (deductible once per damaged item), remainingCap 2600", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        claimStep(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claim: rune damage 200 -> payout 100 (no enchantment or material, no special clause; remainingCap 400)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "rune" }] },
        claimStep(0, [{ itemType: "rune", amount: 200 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // ---- Claim: enchantment vs dragon material ----
  it("claim: dragon-material sword with exactly enchantment 8, damage 1000 -> payout 400 (50 % rule, then deductible; remainingCap 1600)", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        claimStep(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword, enchantment 9, damage 1000 -> payout 400 (both clauses; 50 % rule wins, then deductible)", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        claimStep(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: dragon-material sword, enchantment 5, damage 800 -> payout 700 (only dragon-material clause: full reimbursement then deductible)", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        claimStep(0, [{ itemType: "sword", amount: 800 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim: steel sword, enchantment 9, damage 1000 -> payout 400 (only high-enchantment clause: 50 % first, then deductible)", () => {
    const results = runScenario(
      scenario([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        claimStep(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // ---- Claim: multiple items of the same type (?) ----
  it("claim: two sword damages on a two-sword policy -> each entry a separate damage with its own deductible (500 + 300 -> payout 600, remainingCap 3400)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        claimStep(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("claim rejection: more damage entries of a type than the policy covers (two sword damages, one sword insured) -> non-zero exit, error on stderr, no results on stdout", async () => {
    const { status, stdout, stderr } = await spawnCLI(
      scenario([
        { op: "quote", items: [{ type: "sword" }] },
        claimStep(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]),
      ]),
    );
    expect(status).not.toBe(0);
    expect(stderr.trim().length).toBeGreaterThan(0);
    expect(stdout).not.toContain("results");
  });

  // ---- Claim: cap exhaustion across successive claims ----
  it("claim: sword cap 2000; first claim 1500 -> payout 1400, remainingCap 600", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword" }] },
        claimStep(0, [{ itemType: "sword", amount: 1500 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("claim: sword cap 2000; second successive claim of 1500 -> payout 600, remainingCap 0 (desired 1400 reduced to remaining cap)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword" }] },
        claimStep(0, [{ itemType: "sword", amount: 1500 }]),
        claimStep(0, [{ itemType: "sword", amount: 1500 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // ---- Claim: rounding ----
  it("claim: payout rounds down to whole G (steel sword enchantment 9, damage 901 -> 450.5 - 100 = 350.5 -> payout 350, remainingCap 1650)", () => {
    const results = runScenario(
      scenario([
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        claimStep(0, [{ itemType: "sword", amount: 901 }]),
      ]),
    );
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // ---- Rejection: quote edge cases ----
  it("quote rejection: unknown item type {type: 'broomstick'} -> non-zero exit, error on stderr, no results on stdout", async () => {
    const { status, stdout, stderr } = await spawnCLI(
      scenario([{ op: "quote", items: [{ type: "broomstick" }] }]),
    );
    expect(status).not.toBe(0);
    expect(stderr.trim().length).toBeGreaterThan(0);
    expect(stdout).not.toContain("results");
  });

  // ---- Rejection: claim edge cases ----
  it("claim rejection: damaged itemType 'amulet' not part of the policy (only a sword insured) -> non-zero exit, error on stderr, no results on stdout", async () => {
    const { status, stdout, stderr } = await spawnCLI(
      scenario([
        { op: "quote", items: [{ type: "sword" }] },
        claimStep(0, [{ itemType: "amulet", amount: 300 }]),
      ]),
    );
    expect(status).not.toBe(0);
    expect(stderr.trim().length).toBeGreaterThan(0);
    expect(stdout).not.toContain("results");
  });
  it("claim rejection: damage entry with unknown itemType 'broomstick' -> non-zero exit, error on stderr, no results on stdout", async () => {
    const { status, stdout, stderr } = await spawnCLI(
      scenario([
        { op: "quote", items: [{ type: "sword" }] },
        claimStep(0, [{ itemType: "broomstick", amount: 300 }]),
      ]),
    );
    expect(status).not.toBe(0);
    expect(stderr.trim().length).toBeGreaterThan(0);
    expect(stdout).not.toContain("results");
  });
  it("claim rejection: damage entry with amount -200 -> non-zero exit, error on stderr, no results on stdout", async () => {
    const { status, stdout, stderr } = await spawnCLI(
      scenario([
        { op: "quote", items: [{ type: "sword" }] },
        claimStep(0, [{ itemType: "sword", amount: -200 }]),
      ]),
    );
    expect(status).not.toBe(0);
    expect(stderr.trim().length).toBeGreaterThan(0);
    expect(stdout).not.toContain("results");
  });
});
