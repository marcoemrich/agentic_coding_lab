import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { ClaimOffice, quote } from "./claim-office.js";

interface CliResult {
  status: number;
  stdout: string;
  stderr: string;
}

/** Runs the claim-office CLI on a scenario, as a user of the command would. */
function runCli(scenario: unknown): CliResult {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return { status: failure.status, stdout: failure.stdout, stderr: failure.stderr };
  }
}

describe("MHPCO Claim Office", () => {
  // --- Base premiums per item type (parallel price-list catalogue) ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quotes a single plain sword (100 G base + 10 G first insurance + 5 G fee = 115 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single plain amulet (60 G base + 6 G first insurance + 5 G fee = 71 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single plain staff (80 G base + 8 G first insurance + 5 G fee = 93 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single plain potion (40 G base + 4 G first insurance + 5 G fee = 49 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes a single rune (25 G base + 2.5 G first insurance + 5 G fee = 32.5 G, rounded up to 33 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone (25 G base + 2.5 G first insurance + 5 G fee = 32.5 G, rounded up to 33 G)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });

  // --- Building block of 3 alike components ---
  it("quotes 2 runes at 50 G base premium (no block) -- 60 G total", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes at 60 G base premium (block applies) -- 71 G total", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes)).toBe(71);
  });
  it("quotes 4 runes at 100 G base premium (no block -- block requires exactly 3) -- 115 G total", () => {
    const fourRunes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, fourRunes)).toBe(115);
  });
  it("quotes 7 runes at 175 G base premium (no block -- 7 is not exactly 3) -- 197.5 G, rounded up to 198 G", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes)).toBe(198);
  });

  // --- "Alike" means exactly the same type, not the same family ---
  it("quotes 2 runes + 1 moonstone at 75 G base premium (no block: different types) -- 87.5 G, rounded up to 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones at 120 G base premium (two separate blocks of the same type) -- 137 G total", () => {
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    const moonstones = Array.from({ length: 3 }, () => ({ type: "moonstone" }));
    expect(quote({ yearsWithMHPCO: 0 }, [...runes, ...moonstones])).toBe(137);
  });

  // --- Item-specific modifiers ---
  it("adds a 50 % curse surcharge to a cursed sword's base premium -- 100 G + 50 G curse + 10 G first insurance + 5 G fee = 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge to a sword with enchantment 5 (threshold met) -- 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge to a sword with enchantment 4 (below threshold) -- 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("adds both curse and high-enchantment surcharges to a cursed sword with enchantment 5 -- 195 G", () => {
    const sword = { type: "sword", cursed: true, enchantment: 5 };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(195);
  });
  it("applies item-specific surcharges only to the affected item: cursed sword + plain amulet -> 210 G before policy modifiers and fee, 231 G in total", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("applies the 20 % loyalty discount to the policy base premium for a customer with exactly 2 years with MHPCO -- 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO -- 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge on the policy base premium -- plain sword 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies the 15 % follow-up-contract discount to every quote after the customer's first -- second plain sword quote 100 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    expect(office.quote([{ type: "sword" }])).toBe(100);
  });
  it("applies the first-insurance surcharge to a follow-up contract too (each quoted item is a first insurance) -- 160 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 3 });
    office.quote([{ type: "amulet" }]);
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(office.quote([sword])).toBe(160);
  });

  // --- Premium rounding in MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favour)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes)).toBe(198);
  });
  it("keeps intermediate premium amounts as fractions and rounds only the final premium -- 136.25 G rounds to 137 G, not 136 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 2 });
    office.quote([{ type: "sword" }]);
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(office.quote(sevenRunes)).toBe(137);
  });

  // --- Premium integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3) as 165 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(165);
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) as 160 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 3 });
    office.quote([{ type: "staff" }]);
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(office.quote([sword])).toBe(160);
  });

  // --- Insurance sum and cap ---
  it("sets the cap for a single sword policy to 2000 G (2 x 1000 G insurance sum)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 3 }]);
    const claim = office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] });
    expect(claim.remainingCap).toBe(2000);
  });
  it("sets the cap for a two-sword policy to 4000 G (insurance sum 2000 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "sword" }]);
    const claim = office.claim(0, { cause: "fire", damages: [] });
    expect(claim.remainingCap).toBe(4000);
  });
  it("sets the cap for a sword + amulet policy to 3200 G (insurance sum 1600 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    const claim = office.claim(0, { cause: "fire", damages: [] });
    expect(claim.remainingCap).toBe(3200);
  });
  it("sets the cap for a sword + 3 runes policy to 3500 G (insurance sum 1750 G -- block discount does not reduce the sum)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    const runes = Array.from({ length: 3 }, () => ({ type: "rune" }));
    office.quote([{ type: "sword" }, ...runes]);
    const claim = office.claim(0, { cause: "fire", damages: [] });
    expect(claim.remainingCap).toBe(3500);
  });
  it("bases the cap on the unmodified insurance value: cursed sword (premium 165 G) still has cap 2000 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(office.quote([sword])).toBe(165);
    const claim = office.claim(0, { cause: "fire", damages: [] });
    expect(claim.remainingCap).toBe(2000);
  });

  // --- Standard claim reimbursement ---
  it("pays out 400 G for a steel sword with enchantment 3 damaged by 500 G (full reimbursement minus 100 G deductible)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 3 }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] };
    expect(office.claim(0, incident).payout).toBe(400);
  });
  it("pays out 100 G for a rune damaged by 200 G (no enchantment or material, so no special clause)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "rune" }]);
    const incident = { cause: "curse", damages: [{ itemType: "rune", amount: 200 }] };
    expect(office.claim(0, incident).payout).toBe(100);
  });

  // --- Claim special clauses ---
  it("pays out 400 G for a steel sword with enchantment 9 damaged by 1000 G (50 % clause, then deductible)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 9 }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(office.claim(0, incident).payout).toBe(400);
  });
  it("pays out 700 G for a dragon-material sword with enchantment 5 damaged by 800 G (full reimbursement, then deductible)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 5 }]);
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] };
    expect(office.claim(0, incident).payout).toBe(700);
  });
  it("pays out 400 G for a dragon-material sword with enchantment 9 damaged by 1000 G (50 % rule wins, then deductible)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 9 }]);
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(office.claim(0, incident).payout).toBe(400);
  });
  it("pays out 400 G for a dragon-material sword with exactly enchantment 8 damaged by 1000 G (threshold met)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "dragon", enchantment: 8 }]);
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] };
    expect(office.claim(0, incident).payout).toBe(400);
  });

  // --- Deductible per damage event ---
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -> payout 600 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    };
    expect(office.claim(0, incident).payout).toBe(600);
  });
  it("treats two sword damage entries on a two-sword policy as separate damages, each with its own deductible -- 800 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }, { type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(office.claim(0, incident).payout).toBe(800);
  });

  // --- Payout rounding in MHPCO's favour ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favour)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 9 }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] };
    expect(office.claim(0, incident).payout).toBe(350);
  });

  // --- Cap exhaustion across successive claims ---
  it("reports remainingCap 600 G after a first 1500 G claim on a sword policy (payout 1400 G)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 3 }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    expect(office.claim(0, incident)).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("limits a second 1500 G claim to the remaining cap: payout 600 G, remainingCap 0 G", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword", material: "steel", enchantment: 3 }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] };
    office.claim(0, incident);
    expect(office.claim(0, incident)).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Rejections (observable contract: the domain throws an Error; the CLI exits non-zero and writes the message to stderr) ---
  it("throws an Error when a quote contains an unknown item type (e.g. broomstick)", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow(/broomstick/);
  });
  it("throws an Error when a claim damages an item type that is not part of the policy (amulet damaged, only a sword insured)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] };
    expect(() => office.claim(0, incident)).toThrow(/amulet/);
  });
  it("throws an Error when a claim damages an unknown item type", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] };
    expect(() => office.claim(0, incident)).toThrow(/broomstick/);
  });
  it("throws an Error when a claim contains more damage entries of a type than the policy covers (two sword damages, one sword insured)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    };
    expect(() => office.claim(0, incident)).toThrow(/sword/);
  });
  it("throws an Error when a claim contains a damage entry with a negative amount (-200)", () => {
    const office = new ClaimOffice({ yearsWithMHPCO: 0 });
    office.quote([{ type: "sword" }]);
    const incident = { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] };
    expect(() => office.claim(0, incident)).toThrow(/-200|negative/);
  });

  // --- CLI adapter (src/cli.ts): JSON in, JSON out ---
  it("CLI reads the schema example scenario from stdin and writes {results:[{premium},{payout,remainingCap}]} to stdout", () => {
    const scenario = {
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
    };
    const result = runCli(scenario);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI processes steps sequentially so a claim step resolves its policy by the quote step's zero-based index", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 115 }, { premium: 62 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("CLI exits with a non-zero status and writes an error description to stderr for an unknown quote item type, writing no results to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
  it("CLI exits with a non-zero status and writes an error description to stderr for an invalid claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/-200|negative/);
    expect(result.stdout).toBe("");
  });
});
