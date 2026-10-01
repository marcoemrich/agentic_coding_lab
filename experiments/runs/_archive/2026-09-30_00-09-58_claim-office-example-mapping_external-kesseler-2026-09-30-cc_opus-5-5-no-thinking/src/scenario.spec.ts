import { runScenario } from './scenario';

describe('runScenario', () => {
  it('has no results for a scenario without steps', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [] };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [] });
  });

  it('yields a premium for a quote step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote' as const, items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 165 }] });
  });

  it('treats the second quote of a scenario as a follow-up contract', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'quote' as const, items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  it('applies a claim step to the policy of an earlier quote step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'claim' as const, policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      ],
    };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });

  it.each([1, 7])('rejects a claim referring to step %i which is not a quote', (policy) => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'claim' as const, policy, incident: { cause: 'fire', damages: [] } },
      ],
    };

    const running = () => runScenario(scenario);

    expect(running).toThrow(new RegExp(`no policy at step ${policy}`, 'i'));
  });
});
