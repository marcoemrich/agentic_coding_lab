import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";
const run = (steps: any[], yearsWithMHPCO = 0) => runScenario({ customer: { yearsWithMHPCO }, steps });
const q = (items: any[]) => ({ op: "quote" as const, items });
const c = (policy: number, damages: any[]) => ({ op: "claim" as const, policy, incident: { cause: "fire", damages } });

describe("MHPCO claim office", () => {
  it("quotes empty list at 5 G", () => expect(run([q([])])).toEqual({ results: [{ premium: 5 }] }));
  it("prices main items", () => expect(run([q([{type:"sword"}]),q([{type:"amulet"}]),q([{type:"staff"}]),q([{type:"potion"}])])).toEqual({results:[{premium:115},{premium:62},{premium:81},{premium:43}]}));
  it("prices 2, 3, 4, and 7 runes", () => expect(run([q([{type:"rune"},{type:"rune"}]),q([{type:"rune"},{type:"rune"},{type:"rune"}]),q(Array(4).fill({type:"rune"})),q(Array(7).fill({type:"rune"}))])).toEqual({results:[{premium:60},{premium:62},{premium:100},{premium:172}]}));
  it("keeps component types separate and applies separate blocks", () => expect(run([q([{type:"rune"},{type:"rune"},{type:"moonstone"}]),q([...Array(3).fill({type:"rune"}),...Array(3).fill({type:"moonstone"})])])).toEqual({results:[{premium:88},{premium:119}]}));
  it("applies cursed modifiers only to affected items", () => expect(run([q([{type:"sword",cursed:true},{type:"amulet"}])])).toEqual({results:[{premium:231}]}));
  it("applies modifier thresholds and stacking", () => expect(run([q([{type:"sword",enchantment:5,cursed:true}])],2)).toEqual({results:[{premium:175}]}));
  it("does not apply high enchantment at 4", () => expect(run([q([{type:"sword",enchantment:4,cursed:true}])])).toEqual({results:[{premium:165}]}));
  it("quotes newcomer cursed sword at 165", () => expect(run([q([{type:"sword",cursed:true}])])).toEqual({results:[{premium:165}]}));
  it("uses first-insurance per item on second contract", () => expect(run([q([{type:"sword"}]),q([{type:"sword",cursed:true,enchantment:7}])],3)).toEqual({results:[{premium:95},{premium:160}]}));
  it("rounds premium fractions up", () => expect(run([q([{type:"sword"},{type:"rune",enchantment:5},{type:"rune",cursed:true,enchantment:5}])])).toEqual({results:[{premium:198}]}));
  it("rejects unknown quote types", () => expect(() => run([q([{type:"broomstick"}])])).toThrow("Unknown item type"));
  it("handles standard and rune reimbursement", () => expect(run([q([{type:"sword",material:"steel",enchantment:3},{type:"rune"}]),c(0,[{itemType:"sword",amount:500},{itemType:"rune",amount:200}])])).toEqual({results:[{premium:143},{payout:500,remainingCap:2000}]}));
  it("uses high enchantment before deductible at level 8", () => expect(run([q([{type:"sword",material:"dragon",enchantment:8}]),c(0,[{itemType:"sword",amount:1000}])])).toEqual({results:[{premium:145},{payout:400,remainingCap:1600}]}));
  it("deducts per damage event", () => expect(run([q([{type:"sword"},{type:"amulet"}]),c(0,[{itemType:"sword",amount:500},{itemType:"amulet",amount:300}])])).toEqual({results:[{premium:181},{payout:600,remainingCap:2600}]}));
  it("gives high enchantment precedence over dragon", () => expect(run([q([{type:"sword",material:"dragon",enchantment:9}]),c(0,[{itemType:"sword",amount:1000}])])).toMatchObject({results:[{}, {payout:400}]}));
  it("fully reimburses dragon material below level 8", () => expect(run([q([{type:"sword",material:"dragon",enchantment:5}]),c(0,[{itemType:"sword",amount:800}])])).toMatchObject({results:[{}, {payout:700}]}));
  it("counts duplicate insured items and damages", () => expect(run([q([{type:"sword"},{type:"sword"}]),c(0,[{itemType:"sword",amount:500},{itemType:"sword",amount:500}])])).toMatchObject({results:[{}, {payout:800,remainingCap:3200}]}));
  it("rejects excess, uninsured, unknown, and negative damages", () => {
    for (const d of [[{itemType:"sword",amount:1},{itemType:"sword",amount:1}],[{itemType:"amulet",amount:1}],[{itemType:"broomstick",amount:1}],[{itemType:"sword",amount:-200}]]) expect(() => run([q([{type:"sword"}]),c(0,d)])).toThrow();
  });
  it("uses unmodified values for caps including component blocks", () => expect(run([q([{type:"sword"},{type:"amulet"}]),q([{type:"sword",cursed:true}]),q([{type:"sword"},...Array(3).fill({type:"rune"})]),c(0,[]),c(1,[]),c(2,[])])).toEqual({results:[{premium:181},{premium:150},{premium:157},{payout:0,remainingCap:3200},{payout:0,remainingCap:2000},{payout:0,remainingCap:3500}]}));
  it("exhausts cap across successive claims", () => expect(run([q([{type:"sword"}]),c(0,[{itemType:"sword",amount:1500}]),c(0,[{itemType:"sword",amount:1500}])])).toEqual({results:[{premium:115},{payout:1400,remainingCap:600},{payout:600,remainingCap:0}]}));
  it("rounds fractional payout down at the final result", () => expect(run([q([{type:"sword",enchantment:8}]),c(0,[{itemType:"sword",amount:901}])])).toMatchObject({results:[{}, {payout:350}]}));
  it("CLI reads stdin JSON, writes results JSON, and sends invalid request errors to stderr", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [q([])] });
    expect(JSON.parse(execFileSync("pnpm", ["tsx", "src/cli.ts"], { input, encoding: "utf8" }))).toEqual({ results: [{ premium: 5 }] });
    expect(() => execFileSync("pnpm", ["tsx", "src/cli.ts"], { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [q([{ type: "broomstick" }])] }), encoding: "utf8", stdio: "pipe" })).toThrow();
  });
});
