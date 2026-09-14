import { describe, it, expect } from 'vitest';
import { processInput } from './cli-core';

describe('processInput', () => {
  it('maps a JSON scenario document to a JSON results document', () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(JSON.parse(processInput(input))).toEqual({ results: [{ premium: 59 }] });
  });
});
