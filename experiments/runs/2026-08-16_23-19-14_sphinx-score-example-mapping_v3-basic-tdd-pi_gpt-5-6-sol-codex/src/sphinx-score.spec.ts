import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import { scoreSphinx, type Card } from './sphinx-score';

const sphinx: Card = { monster: 'sphinx' };

function army(...monsters: Card[]): Card[] {
  return monsters;
}

function monster(monster: Card['monster']): Card {
  return { monster };
}

describe('Sphinx scoring', () => {
  it.each([
    [army(sphinx, monster('chimera'), monster('orthrus')), 2],
    [army(sphinx, monster('chimera'), monster('orthrus'), monster('zombie'), monster('hydra')), 3],
    [army(sphinx, monster('chimera'), monster('orthrus'), monster('zombie'), monster('hydra'), monster('cyclops')), 5],
  ])('scores a single Sphinx according to the types on the other cards', (cards, expected) => {
    expect(scoreSphinx(cards)).toBe(expected);
  });

  it.each([
    [army(sphinx, sphinx, monster('chimera'), monster('orthrus')), 4],
    [army(sphinx, sphinx, monster('chimera'), monster('orthrus'), monster('zombie')), 6],
  ])('allows each Sphinx to see another Sphinx', (cards, expected) => {
    expect(scoreSphinx(cards)).toBe(expected);
  });

  it.each([
    [army(sphinx, monster('cyclops')), 2],
    [army(sphinx, monster('chimera'), monster('orthrus')), 2],
  ])('awards one bonus point rather than one per type when no more than three types are seen', (cards, expected) => {
    expect(scoreSphinx(cards)).toBe(expected);
  });

  it.each([
    [army(sphinx, { monster: 'undead-warrior', rank: 1 }, { monster: 'undead-warrior', rank: 3 }, monster('chimera')), 2],
    [army(sphinx, { monster: 'undead-warrior', rank: 1 }, { monster: 'undead-warrior', rank: 2 }, { monster: 'undead-warrior', rank: 3 }, monster('cyclops'), monster('orthrus'), monster('chimera')), 3],
  ])('treats all Undead Warrior ranks as one monster type', (cards, expected) => {
    expect(scoreSphinx(cards)).toBe(expected);
  });

  it('counts repeated cards of a monster as one type', () => {
    const cards = army(sphinx, monster('chimera'), monster('chimera'), monster('chimera'), monster('orthrus'), monster('orthrus'));
    expect(scoreSphinx(cards)).toBe(2);
  });

  it('scores an army without a Sphinx as zero', () => {
    expect(scoreSphinx(army(monster('chimera'), monster('orthrus'), monster('zombie')))).toBe(0);
  });
});

describe('CLI', () => {
  it('reads an army from stdin and writes its score as JSON', () => {
    const input = JSON.stringify({
      army: [sphinx, monster('chimera'), monster('orthrus'), monster('zombie'), monster('hydra')],
    });
    const result = spawnSync('pnpm', ['exec', 'tsx', 'src/cli.ts'], {
      cwd: process.cwd(),
      input,
      encoding: 'utf8',
    });

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ score: 3 });
  });
});
