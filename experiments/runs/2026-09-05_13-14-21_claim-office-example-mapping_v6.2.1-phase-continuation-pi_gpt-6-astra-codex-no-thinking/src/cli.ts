#!/usr/bin/env -S npx tsx
import { readFileSync } from "node:fs";
interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
interface Quote { op: "quote"; items: Item[] }
interface Claim { op: "claim"; policy: number; incident: { cause: string; damages: { itemType: string; amount: number }[] } }
interface Scenario { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] }
const scenario: Scenario = JSON.parse(readFileSync(0, "utf8"));
const basePremiumByItemType: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const totalPayoutByPolicyStepIndex: Record<number, number> = {};
const results = scenario.steps.map((step, stepIndex) => {
  if (step.op === "claim") {
    const policy = scenario.steps[step.policy] as Quote;
    const unmatchedInsuredItems = [...policy.items];
    const payoutBeforePolicyCap = step.incident.damages.reduce((payoutSubtotal, reportedDamage) => {
      if (reportedDamage.amount < 0) throw new Error("Negative damage amount");
      const matchingInsuredItemIndex = unmatchedInsuredItems.findIndex(item => item.type === reportedDamage.itemType);
      if (matchingInsuredItemIndex < 0) throw new Error(`Damage item not insured or excess entries: ${reportedDamage.itemType}`);
      const [insuredItem] = unmatchedInsuredItems.splice(matchingInsuredItemIndex, 1);
      const enchantmentAdjustedDamage = reportedDamage.amount * ((insuredItem.enchantment ?? 0) >= 8 ? 0.5 : 1);
      return payoutSubtotal + Math.max(0, enchantmentAdjustedDamage - 100);
    }, 0);
    const insuranceSum = policy.items.reduce((insuranceValueSubtotal, item) => insuranceValueSubtotal + basePremiumByItemType[item.type] * 10, 0);
    const previousPayouts = totalPayoutByPolicyStepIndex[step.policy] ?? 0;
    const remainingCapBeforeClaim = insuranceSum * 2 - previousPayouts;
    const payout = Math.floor(Math.min(payoutBeforePolicyCap, remainingCapBeforeClaim));
    totalPayoutByPolicyStepIndex[step.policy] = previousPayouts + payout;
    return { payout, remainingCap: remainingCapBeforeClaim - payout };
  }
  for (const item of step.items) {
    if (!Object.hasOwn(basePremiumByItemType, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const totalBasePremium = step.items.reduce((basePremiumSubtotal, item) => {
    const isThreeItemComponentBlock = (item.type === "rune" || item.type === "moonstone")
      && step.items.filter(other => other.type === item.type).length === 3;
    return basePremiumSubtotal + (isThreeItemComponentBlock ? 20 : basePremiumByItemType[item.type]);
  }, 0);
  const curseSurcharge = step.items.reduce((curseSurchargeSubtotal, item) => curseSurchargeSubtotal + (item.cursed ? basePremiumByItemType[item.type] / 2 : 0), 0);
  const enchantmentSurcharge = step.items.reduce((enchantmentSurchargeSubtotal, item) => enchantmentSurchargeSubtotal + ((item.enchantment ?? 0) >= 5 ? basePremiumByItemType[item.type] * 0.3 : 0), 0);
  const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? totalBasePremium / 5 : 0;
  const followUpDiscount = stepIndex > 0 ? totalBasePremium * 0.15 : 0;
  return { premium: Math.ceil(totalBasePremium + curseSurcharge + enchantmentSurcharge + totalBasePremium / 10 - loyaltyDiscount - followUpDiscount + 5) };
});
console.log(JSON.stringify({ results }));
