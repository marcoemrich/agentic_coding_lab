export type Monster =
  | 'sphinx'
  | 'undead-warrior'
  | 'zombie'
  | 'hydra'
  | 'cyclops'
  | 'orthrus'
  | 'chimera';

export interface Card {
  monster: Monster;
  // These literals mirror the three variants in the input schema.
  // eslint-disable-next-line no-magic-numbers
  rank?: 1 | 2 | 3;
}

const TYPE_THRESHOLD = 3;
const POINTS_PER_TYPE_BEYOND_THRESHOLD = 2;

/** Returns the combined score produced by all Sphinx cards in an army. */
export function scoreSphinx(army: readonly Card[]): number {
  const sphinxCount = army.filter(({ monster }) => monster === 'sphinx').length;
  if (sphinxCount === 0) return 0;

  const otherTypes = new Set(
    army
      .filter(({ monster }) => monster !== 'sphinx')
      .map(({ monster }) => monster),
  );
  const typesSeenByEachSphinx = otherTypes.size + Number(sphinxCount > 1);
  const bonus = typesSeenByEachSphinx > TYPE_THRESHOLD
    ? POINTS_PER_TYPE_BEYOND_THRESHOLD * (typesSeenByEachSphinx - TYPE_THRESHOLD)
    : 1;

  return sphinxCount * (1 + bonus);
}
