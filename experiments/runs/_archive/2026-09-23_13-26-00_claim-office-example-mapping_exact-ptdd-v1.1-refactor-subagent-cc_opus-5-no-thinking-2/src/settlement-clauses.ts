import { type Item } from "./item-pricing.js";

const SEVERE_ENCHANTMENT_LEVEL = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";
const FULL_REIMBURSEMENT_RATE = 1;

/** Whether the MHPCO's severe-enchantment clause covers this damaged object. */
function isSeverelyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT_LEVEL;
}

/** Whether the MHPCO's dragon-material clause covers this damaged object. */
function isDragonMaterial(item: Item): boolean {
  return item.material === DRAGON_MATERIAL;
}

/**
 * A reimbursement clause of the MHPCO's settlement rulebook: the condition
 * under which the office applies it, and the share of the damage it reimburses.
 * Condition and share belong to one clause and change together. The clauses are
 * listed in the order the office resolves them: where several clauses cover the
 * same damage, the first listed wins.
 */
interface ReimbursementClause {
  appliesTo(item: Item): boolean;
  share: number;
}

const REIMBURSEMENT_CLAUSES: ReimbursementClause[] = [
  { appliesTo: isSeverelyEnchanted, share: SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE },
  { appliesTo: isDragonMaterial, share: FULL_REIMBURSEMENT_RATE },
];

/**
 * The share of a damage the MHPCO's settlement rulebook reimburses: the share
 * of the first clause that covers the damaged object, or full reimbursement
 * when no clause does. This is the office's judgement about what it owes for
 * the damage itself, before the deductible and the cap the policy imposes.
 */
export function reimbursedShareOf(damageAmount: number, damagedItem: Item): number {
  const clause = REIMBURSEMENT_CLAUSES.find((candidate) => candidate.appliesTo(damagedItem));
  return damageAmount * (clause?.share ?? FULL_REIMBURSEMENT_RATE);
}
