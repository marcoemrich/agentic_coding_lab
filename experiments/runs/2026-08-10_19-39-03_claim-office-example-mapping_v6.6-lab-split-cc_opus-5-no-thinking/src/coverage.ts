// What a policy covers, and what it pays out. The mirror image of pricing.ts:
// that module answers what the customer pays us, this one answers what we pay
// the customer. Both are asked by claim-office.ts, which knows the order the
// questions come in; neither knows anything about scenarios or steps.

import { type Item, type KnownItemType } from "./pricing.js";
import { roundDownInFavourOfMHPCO } from "./rounding.js";
import { claimRejection } from "./rejection.js";

export interface Damage {
  itemType: string;
  amount: number;
}

// What an item is insured FOR, as opposed to what insuring it costs. Payout
// caps are derived from these; premiums are not.
//
// Deliberately typed as a TOTAL Record over KnownItemType, and deliberately
// looked up UNGUARDED below, unlike the price list in pricing.ts. Two reasons,
// and the type is the load-bearing one:
//
//  - Adding a type to pricing.ts's BASE_PREMIUM_BY_TYPE without adding it here
//    is a compile error, so the two tables cannot drift apart silently. The
//    price list needs its runtime guard because item types arrive from parsed
//    JSON and can be values TypeScript never saw; this table is only ever
//    indexed by a type that already survived that guard.
//  - A quote is rejected before any policy exists, so no unknown type can
//    reach a cap. A throw here would be a branch no test could turn red.
const INSURANCE_VALUE_BY_TYPE: Record<KnownItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE_BY_TYPE[item.type], 0);

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

// A policy pays out at most twice what its items are insured for. Premium
// modifiers — curses, enchantments, block discounts — shift what the policy
// COSTS and never what it COVERS, so the cap reads insurance values only.
export const capFor = (items: Item[]): number =>
  CAP_MULTIPLE_OF_INSURANCE_SUM * insuranceSumOf(items);

// What a claim actually pays, once the policy's own limit is consulted. The
// cap is a running total: a policy pays out at most twice its insurance sum
// ACROSS all its claims, so each settlement both reads the cap left to it and
// reports what remains for the next one.
//
// Lives here beside capFor rather than in the orchestrator: establishing the
// limit and enforcing it are one rule, and claim-office.ts is only meant to
// know the order the questions come in, not the answers.
export interface Settlement {
  payout: number;
  remainingCap: number;
}

// Settling is where the damages stop being a running calculation and become
// money, so it is where the payout is rounded — down, in the MHPCO's favour.
// Rounding here rather than afterwards also keeps the cap whole: what leaves
// the cap is exactly what the customer is paid.
export const settleClaim = (
  grossPayout: number,
  remainingCap: number,
): Settlement => {
  const payout = roundDownInFavourOfMHPCO(Math.min(grossPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
};

const DEDUCTIBLE_PER_DAMAGE = 100;

const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_SHARE = 0.5;

const FULL_REIMBURSEMENT_SHARE = 1;

// Named for the clause it gates rather than for a degree of enchantment:
// pricing.ts has its own, LOWER enchantment threshold (>= 5, a premium
// surcharge), and the two are easy to confuse when both read as adjectives.
const qualifiesForHalfReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

// The reimbursement clauses in the order the MHPCO applies them: the FIRST
// matching clause decides the share, later ones never override it. Order is
// the whole content of the rule, which is why this stays a list of one rather
// than collapsing into the conditional it currently is — the next clause the
// spec forces is appended here, and its position is the decision.
//
// A clause matching NOTHING falls through to FULL_REIMBURSEMENT_SHARE below.
// That default is deliberately NOT written as a catch-all clause at the end of
// this list: a catch-all makes the `find` total, which in turn makes the `??`
// that expresses the default unreachable, so the same "full unless stated
// otherwise" rule ends up stated twice and one of the two statements is dead.
//
// Half reimbursement: the MHPCO holds that a strongly enchanted item's magic
// bears part of its own misfortune.
const REIMBURSEMENT_CLAUSES: {
  applies: (item: Item) => boolean;
  share: number;
}[] = [
  { applies: qualifiesForHalfReimbursement, share: HALF_REIMBURSEMENT_SHARE },
];

// Deliberately ABSENT: the spec's "dragon material => full reimbursement"
// clause, which would sit above the half clause. It is unwritten because it is
// untestable from the spec's examples — full reimbursement is also the default,
// so every dragon example yields the same payout with or without it. The one
// case that WOULD distinguish the two orderings, a dragon item with
// enchantment >= 8, is fixed by example at HALF (see the enchantment-9 test),
// which is the opposite of what a dragon-first clause would pay. So the spec's
// own examples contradict placing a dragon clause first, and no example
// justifies placing it anywhere else. Adding one here would be guesswork
// dressed as fidelity; `material` stays unread until an example forces it.

const reimbursementShareFor = (item: Item): number =>
  REIMBURSEMENT_CLAUSES.find(({ applies }) => applies(item))?.share ??
  FULL_REIMBURSEMENT_SHARE;

const reimbursementFor = (item: Item, damage: Damage): number =>
  damage.amount * reimbursementShareFor(item);

// The customer bears the first 100 G of each damage entry separately, so two
// damaged swords carry two deductibles rather than one. The deductible comes
// off AFTER the reimbursement clauses have reduced the amount.
//
// Named for the single subtraction it performs, not for the final payout: this
// result is not floored at zero, and the policy's remaining cap is applied
// later by settleClaim rather than here. Flooring is still it.todo() in the
// spec ("exhausts the cap across successive claims"); until an example forces
// it, the name must not claim a settlement this does not compute.
const netOfDeductible = (item: Item, damage: Damage): number =>
  reimbursementFor(item, damage) - DEDUCTIBLE_PER_DAMAGE;

// Two different ways a damage can fail to find an insured item, which the
// MHPCO rejects for two different reasons. A policy that insures no amulet at
// all does not "cover more amulet damages than it insures" — it covers none,
// and the claim names an item the customer never brought in. Telling them
// apart needs the policy's ORIGINAL items, not just the ones still unclaimed.
const uninsuredTypeError = (itemType: string): Error =>
  claimRejection(`names a ${itemType}, which the policy does not insure`);

const overClaimedTypeError = (itemType: string): Error =>
  claimRejection(`covers more ${itemType} damages than the policy insures`);

const unmatchedDamageError = (insured: Item[], itemType: string): Error =>
  insured.some((item) => item.type === itemType)
    ? overClaimedTypeError(itemType)
    : uninsuredTypeError(itemType);

// Which insured item a damage entry is paid against. A damage names its item
// by type only, so the first insured item of that type answers it — but each
// insured item is damaged at most once per claim, so a matched item is removed
// from those still available. Two sword damages need two insured swords.
const takeDamagedItem = (
  insured: Item[],
  available: Item[],
  damage: Damage,
): { item: Item; remaining: Item[] } => {
  const index = available.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw unmatchedDamageError(insured, damage.itemType);
  }
  return {
    item: available[index],
    remaining: available.filter((_, at) => at !== index),
  };
};

// Each damage paired with the insured item it is settled against. Separated
// from the summing below because pairing and arithmetic are two rules: which
// item answers a damage is a matching question, what that pair pays is not.
// This is also where an unmatched damage is rejected, so payoutForDamages sees
// only pairs it can price.
interface SettledPair {
  item: Item;
  damage: Damage;
}

const pairDamagesWithItems = (
  items: Item[],
  damages: Damage[],
): SettledPair[] =>
  damages.reduce<{ pairs: SettledPair[]; available: Item[] }>(
    ({ pairs, available }, damage) => {
      const { item, remaining } = takeDamagedItem(items, available, damage);
      return { pairs: [...pairs, { item, damage }], available: remaining };
    },
    { pairs: [], available: items },
  ).pairs;

// A damage is a loss, never a gain: a negative amount would pay the MHPCO's
// own money back into the policy's cap, so the claim is rejected outright.
const rejectNegativeAmounts = (damages: Damage[]): void => {
  const gain = damages.find(({ amount }) => amount < 0);
  if (gain !== undefined) {
    throw claimRejection(
      `reports a negative ${gain.itemType} damage of ${gain.amount}`,
    );
  }
};

export const payoutForDamages = (items: Item[], damages: Damage[]): number => {
  rejectNegativeAmounts(damages);
  return pairDamagesWithItems(items, damages).reduce(
    (total, { item, damage }) => total + netOfDeductible(item, damage),
    0,
  );
};
