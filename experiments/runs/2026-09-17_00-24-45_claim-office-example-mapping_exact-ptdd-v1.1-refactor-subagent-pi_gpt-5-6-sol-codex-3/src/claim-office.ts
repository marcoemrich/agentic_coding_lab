import { takeCoveredItem } from "./claim-coverage.js";
import { assertDamageAmountIsNonNegative } from "./claim-damage-validation.js";
import { payoutAfterDamageEventDeductible } from "./claim-deductible.js";
import { reimbursableDamage } from "./claim-reimbursement.js";
import { itemBasePremium } from "./item-catalogue.js";
import { basePremiumForItems } from "./policy-base-premium.js";
import {
  initialPolicyPayoutCap,
  payoutAllowedByRemainingPolicyCap,
} from "./policy-payout-cap.js";

interface QuoteItem {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep { op: "quote"; items: QuoteItem[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
interface Policy { items: QuoteItem[]; remainingCap: number }
type Result = { premium: number } | { payout: number; remainingCap: number };

const CURSED_ITEM_SURCHARGE_RATE = 0.5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const PROCESSING_FEE_G = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function cursedItemSurcharge(basePremium: number, cursed: boolean | undefined): number {
  return cursed ? basePremium * CURSED_ITEM_SURCHARGE_RATE : 0;
}

function firstInsuranceSurcharge(basePremium: number): number {
  return basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function isFollowUpContract(contractIndex: number): boolean {
  return contractIndex > 0;
}

function followUpContractDiscount(basePremium: number, isFollowUpContract: boolean): number {
  return isFollowUpContract ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

function isHighlyEnchanted(enchantment: number | undefined): boolean {
  return (enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function highEnchantmentSurcharge(basePremium: number, enchantment: number | undefined): number {
  return isHighlyEnchanted(enchantment) ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
}

function itemRiskSurcharge(item: QuoteItem): number {
  const basePremium = itemBasePremium(item.type);
  return cursedItemSurcharge(basePremium, item.cursed)
    + highEnchantmentSurcharge(basePremium, item.enchantment);
}

function itemRiskSurcharges(items: QuoteItem[] | undefined): number {
  return items?.reduce((sum, item) => sum + itemRiskSurcharge(item), 0) ?? 0;
}

function roundPremiumInMHPCOFavor(premium: number): number {
  return Math.ceil(premium);
}

function quotePremium(items: QuoteItem[] | undefined, yearsWithMHPCO: number, isFollowUpContract: boolean): number {
  const basePremium = basePremiumForItems(items);
  const premium = basePremium + itemRiskSurcharges(items) + firstInsuranceSurcharge(basePremium)
    - loyaltyDiscount(basePremium, yearsWithMHPCO)
    - followUpContractDiscount(basePremium, isFollowUpContract) + PROCESSING_FEE_G;
  return roundPremiumInMHPCOFavor(premium);
}

function policyFor(items: QuoteItem[]): Policy {
  return { items, remainingCap: initialPolicyPayoutCap(items) };
}

function damagePayout(damage: Damage, item: QuoteItem): number {
  assertDamageAmountIsNonNegative(damage.amount);
  return payoutAfterDamageEventDeductible(reimbursableDamage(damage, item));
}

function desiredClaimPayout(damages: Damage[], insuredItems: QuoteItem[]): number {
  const availableItems = [...insuredItems];
  return damages.reduce((sum, damage) => (
    sum + damagePayout(damage, takeCoveredItem(damage.itemType, availableItems))
  ), 0);
}

function roundPayoutInMHPCOFavor(payout: number): number {
  return Math.floor(payout);
}

function claimResult(step: ClaimStep, policy: Policy): Result {
  const desiredPayout = desiredClaimPayout(step.incident.damages, policy.items);
  const payout = payoutAllowedByRemainingPolicyCap(
    roundPayoutInMHPCOFavor(desiredPayout),
    policy.remainingCap,
  );
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function executeScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") return claimResult(step, policies.get(step.policy) as Policy);
    const result = { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUpContract(quoteCount)) };
    quoteCount += 1;
    policies.set(index, policyFor(step.items));
    return result;
  });
  return { results };
}
