export interface Card {
  monster: string;
  rank?: number;
}

const SPHINX = "sphinx";

const isSphinx = (card: Card): boolean => card.monster === SPHINX;

// A card's type is its monster alone. Rank is a variation within a type, not a
// type of its own: Undead Warrior (1) and Undead Warrior (3) are one type.
const typeOf = (card: Card): string => card.monster;

const countMonsterTypes = (army: Card[]): number =>
  new Set(army.map(typeOf)).size;

// Points per Sphinx step up with the army's variety. The complete example set
// confirms the mapping (monster types -> points per Sphinx):
//   2 -> 2, 3 -> 2, 4 -> 3, 5 -> 3, 6 -> 5
// The step to 5 breaks any linear or evenly-stepped formula, so the rule stays
// a table of the tiers the examples actually pin down.
// Ordered from the most varied army down; the first tier the army reaches wins.
const POINTS_PER_SPHINX_TIERS: { minMonsterTypes: number; pointsPerSphinx: number }[] = [
  { minMonsterTypes: 6, pointsPerSphinx: 5 },
  { minMonsterTypes: 4, pointsPerSphinx: 3 },
];

const BASE_POINTS_PER_SPHINX = 2;

const pointsPerSphinxFor = (monsterTypeCount: number): number =>
  POINTS_PER_SPHINX_TIERS.find((tier) => monsterTypeCount >= tier.minMonsterTypes)
    ?.pointsPerSphinx ?? BASE_POINTS_PER_SPHINX;

const countSphinxes = (army: Card[]): number => army.filter(isSphinx).length;

export const scoreArmy = (army: Card[]): number =>
  countSphinxes(army) * pointsPerSphinxFor(countMonsterTypes(army));
