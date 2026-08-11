export type Card = {
  monster: string;
  rank?: number;
};

const SPHINX = "sphinx";
const BASE_SCORE = 1;
const FREE_TYPE_ALLOWANCE = 3;
const MINIMUM_BONUS = 1;
const BONUS_PER_EXTRA_TYPE = 2;

const countSphinxes = (army: Card[]): number =>
  army.filter((card) => card.monster === SPHINX).length;

const countTypes = (army: Card[]): number =>
  new Set(army.map((card) => card.monster)).size;

/** A Sphinx scores on every card in the army except the one it is scoring for. */
const armySeenBySphinx = (army: Card[]): Card[] => {
  const ownCardIndex = army.findIndex((card) => card.monster === SPHINX);
  return army.filter((_, index) => index !== ownCardIndex);
};

const varietyBonus = (typeCount: number): number =>
  typeCount > FREE_TYPE_ALLOWANCE
    ? BONUS_PER_EXTRA_TYPE * (typeCount - FREE_TYPE_ALLOWANCE)
    : MINIMUM_BONUS;

const scoreOneSphinx = (army: Card[]): number =>
  BASE_SCORE + varietyBonus(countTypes(armySeenBySphinx(army)));

export const scoreArmy = (army: Card[]): number =>
  countSphinxes(army) * scoreOneSphinx(army);
