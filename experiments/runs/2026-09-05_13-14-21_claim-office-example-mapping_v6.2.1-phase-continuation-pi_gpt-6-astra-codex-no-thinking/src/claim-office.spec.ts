import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

function run(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync("./claim-office", [], {
    input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: "utf8",
  });
}
function scenario(steps: unknown[], years = 0) {
  const result = run(steps, years);
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout).results;
}
const quote = (items: unknown[]) => ({ op: "quote", items });
const items = (type: string, count = 1) => Array.from({ length: count }, () => ({ type }));
const claim = (damages: unknown[], policy = 0) => ({ op: "claim", policy, incident: { cause: "dragon attack", damages } });
const damage = (itemType: string, amount: number) => ({ itemType, amount });

describe("MHPCO", () => {
  it("empty items cost 5 G", () => {
    expect(scenario([quote([])])).toEqual([{ premium: 5 }]);
  });
  it("sword base 100 and value 1000", () => {
    expect(scenario([quote(items("sword"))])).toEqual([{ premium: 115 }]);
  });
  it("amulet base 60 and value 600", () => {
    expect(scenario([quote(items("amulet"))])).toEqual([{ premium: 71 }]);
  });
  it("staff base 80 and value 800", () => {
    expect(scenario([quote(items("staff"))])).toEqual([{ premium: 93 }]);
  });
  it("potion base 40 and value 400", () => {
    expect(scenario([quote(items("potion"))])).toEqual([{ premium: 49 }]);
  });
  it("one component base 25 and value 250", () => {
    expect(scenario([quote(items("rune"))])).toEqual([{ premium: 33 }]);
  });
  it("2 runes base 50", () => {
    expect(scenario([quote(items("rune", 2))])).toEqual([{ premium: 60 }]);
  });
  it("3 runes base 60 with value 750", () => {
    expect(scenario([quote(items("rune", 3))])).toEqual([{ premium: 71 }]);
  });
  it("4 runes base 100 not a block", () => {
    expect(scenario([quote(items("rune", 4))])).toEqual([{ premium: 115 }]);
  });
  it("7 runes base 175 not blocks", () => {
    expect(scenario([quote(items("rune", 7))])).toEqual([{ premium: 198 }]);
  });
  it("2 runes and moonstone base 75", () => {
    expect(scenario([quote([...items("rune", 2), ...items("moonstone")])])).toEqual([{ premium: 88 }]);
  });
  it("3 runes and 3 moonstones base 120", () => {
    expect(scenario([quote([...items("rune", 3), ...items("moonstone", 3)])])).toEqual([{ premium: 137 }]);
  });
  it("newcomer cursed sword costs 165", () => {
    expect(scenario([quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])])).toEqual([{ premium: 165 }]);
  });
  it("cursed sword and plain amulet subtotal 210 before policy modifiers", () => {
    expect(scenario([quote([{ type: "sword", cursed: true }, { type: "amulet" }])])).toEqual([{ premium: 231 }]);
  });
  it("exactly 2 years earns 20 percent loyalty", () => {
    expect(scenario([quote(items("sword"))], 2)).toEqual([{ premium: 95 }]);
    expect(scenario([quote(items("sword"))], 1)).toEqual([{ premium: 115 }]);
  });
  it("enchantment 5 adds 30 percent", () => {
    expect(scenario([quote([{ type: "sword", enchantment: 5 }])])).toEqual([{ premium: 145 }]);
  });
  it("cursed enchantment 5 adds both surcharges", () => {
    expect(scenario([quote([{ type: "sword", enchantment: 5, cursed: true }])])).toEqual([{ premium: 195 }]);
  });
  it("enchantment 4 adds no surcharge", () => {
    expect(scenario([quote([{ type: "sword", enchantment: 4 }])])).toEqual([{ premium: 115 }]);
  });
  it("cursed enchantment 4 adds curse only", () => {
    expect(scenario([quote([{ type: "sword", enchantment: 4, cursed: true }])])).toEqual([{ premium: 165 }]);
  });
  it("loyal second quote cursed sword enchantment 7 costs 160", () => {
    expect(scenario([quote(items("amulet")), quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])], 3)).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it("premium 197.5 rounds up to 198 only at end", () => {
    expect(scenario([quote(items("rune", 7))])).toEqual([{ premium: 198 }]);
    expect(scenario([quote([{ type: "rune", cursed: true }, { type: "moonstone", cursed: true }])])).toEqual([{ premium: 85 }]);
  });
  it("regular steel sword enchantment 3 damage 500 pays 400", () => {
    expect(scenario([quote([{ type: "sword", material: "steel", enchantment: 3 }]), claim([damage("sword", 500)])])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("rune damage 200 pays 100", () => {
    expect(scenario([quote(items("rune")), claim([damage("rune", 200)])])[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword enchantment 8 damage 1000 pays 400", () => {
    expect(scenario([quote([{ type: "sword", material: "dragon", enchantment: 8 }]), claim([damage("sword", 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 9 damage 1000 pays 400", () => {
    expect(scenario([quote([{ type: "sword", material: "dragon", enchantment: 9 }]), claim([damage("sword", 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5 damage 800 pays 700", () => {
    expect(scenario([quote([{ type: "sword", material: "dragon", enchantment: 5 }]), claim([damage("sword", 800)])])[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9 damage 1000 pays 400", () => {
    expect(scenario([quote([{ type: "sword", material: "steel", enchantment: 9 }]), claim([damage("sword", 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword damage 500 and amulet damage 300 pay 600 with cap 3200", () => {
    expect(scenario([quote([...items("sword"), ...items("amulet")]), claim([damage("sword", 500), damage("amulet", 300)])])[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords value 2000 cap 4000 and separate deductibles", () => {
    expect(scenario([quote(items("sword", 2)), claim([damage("sword", 500), damage("sword", 300)])])).toEqual([{ premium: 225 }, { payout: 600, remainingCap: 3400 }]);
  });
  it("cursed sword premium 165 has cap 2000", () => {
    expect(scenario([quote([{ type: "sword", cursed: true }]), claim([])])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword and 3 runes value 1750 cap 3500", () => {
    expect(scenario([quote([...items("sword"), ...items("rune", 3)]), claim([])])).toEqual([{ premium: 181 }, { payout: 0, remainingCap: 3500 }]);
  });
  it("successive 1500 claims pay 1400 then 600 and exhaust cap", () => {
    expect(scenario([quote(items("sword")), claim([damage("sword", 1500)]), claim([damage("sword", 1500)]), claim([damage("sword", 1500)])])).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it("payout 350.5 rounds down to 350", () => {
    expect(scenario([quote([{ type: "sword", enchantment: 8 }]), claim([damage("sword", 901)])])[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("fractional intermediate payouts are rounded only after summing", () => {
    expect(scenario([quote([{ type: "sword", enchantment: 8 }, { type: "amulet", enchantment: 9 }]), claim([damage("sword", 901), damage("amulet", 901)])])[1]).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it("damage below deductible pays zero", () => {
    expect(scenario([quote(items("sword")), claim([damage("sword", 50)])])[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("schema example loyal amulet quote then damage 200 pays 100", () => {
    expect(scenario([quote([{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]), { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage("amulet", 200)] } }], 5)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("policy references use step index rather than quote count", () => {
    expect(scenario([quote(items("sword")), claim([damage("sword", 500)]), quote(items("staff")), claim([damage("staff", 200)], 2), quote(items("potion")), claim([], 4)])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 81 }, { payout: 100, remainingCap: 1500 }, { premium: 43 }, { payout: 0, remainingCap: 800 }]);
  });
  it("unknown quote type rejects with stderr and no stdout results", () => {
    const result = run([quote(items("sword")), quote(items("broomstick"))]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("uninsured amulet damage rejects", () => {
    const result = run([quote(items("sword")), claim([damage("amulet", 200)])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("unknown damage type rejects", () => {
    const result = run([quote(items("sword")), claim([damage("broomstick", 200)])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("negative damage rejects", () => {
    const result = run([quote(items("sword")), claim([damage("sword", -200)])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative/i);
    expect(result.stdout).toBe("");
  });
  it("excess same-type damage entries reject whole claim", () => {
    const result = run([quote(items("sword")), claim([damage("sword", 500), damage("sword", 300)])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not insured|excess/i);
    expect(result.stdout).toBe("");
  });
});
