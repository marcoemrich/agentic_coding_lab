export type Monster =
  | "sphinx"
  | "undead-warrior"
  | "zombie"
  | "hydra"
  | "cyclops"
  | "orthrus"
  | "chimera";

export interface MonsterCard {
  monster: Monster;
  rank?: number;
}

export interface Army {
  army: MonsterCard[];
}

const ONE_MONSTER_TYPE_POINTS = 1;
const ONE = ONE_MONSTER_TYPE_POINTS;
const TWO = ONE_MONSTER_TYPE_POINTS + ONE;
const THREE = TWO + ONE;
const FOUR = THREE + ONE;
const FIVE = FOUR + ONE;

const ONE_MONSTER_TYPE_SCORE = ONE_MONSTER_TYPE_POINTS;
const TWO_MONSTER_TYPES_SCORE = TWO;
const FOUR_MONSTER_TYPES_SCORE = THREE;
const FIVE_MONSTER_TYPES_SCORE = FOUR_MONSTER_TYPES_SCORE;
const SIX_MONSTER_TYPES_SCORE = TWO_MONSTER_TYPES_SCORE + THREE;

export function calculateSphinxScore(armyInput: Army): number {
  const sphinxCount = armyInput.army.filter((card) => card.monster === "sphinx").length;
  if (sphinxCount === 0) {
    return 0;
  }

  const monsterTypeCount = new Set(armyInput.army.map((card) => card.monster)).size;

  if (monsterTypeCount === ONE) {
    return sphinxCount * ONE_MONSTER_TYPE_SCORE;
  }

  if (monsterTypeCount === TWO || monsterTypeCount === THREE) {
    return sphinxCount * TWO_MONSTER_TYPES_SCORE;
  }

  if (monsterTypeCount === FOUR) {
    return sphinxCount * FOUR_MONSTER_TYPES_SCORE;
  }

  if (monsterTypeCount === FIVE) {
    return sphinxCount * FIVE_MONSTER_TYPES_SCORE;
  }

  return sphinxCount * SIX_MONSTER_TYPES_SCORE;
}

