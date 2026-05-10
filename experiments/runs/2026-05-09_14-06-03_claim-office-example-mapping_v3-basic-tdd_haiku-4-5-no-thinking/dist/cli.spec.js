import { describe, it, expect } from 'vitest';
import { calculateQuote } from './quotes.js';
import { calculateClaim } from './claims.js';
describe('Integration tests', () => {
    it('processes a simple quote and claim scenario', () => {
        // Quote: amulet with 5 years customer
        const premium = calculateQuote({ yearsWithMHPCO: 5 }, [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]);
        expect(premium).toBe(59); // 60 - 12 loyalty + 6 first insurance + 5 fee
        // Claim on that amulet
        const policy = {
            items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        };
        const result = calculateClaim(policy, [{ itemType: 'amulet', amount: 200 }]);
        expect(result).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it('handles newcomer with cursed sword quote', () => {
        const premium = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]);
        expect(premium).toBe(165); // 100 + 50 curse + 10 first insurance + 5 fee
    });
    it('handles long-standing customer second contract', () => {
        const premium = calculateQuote({ yearsWithMHPCO: 3 }, [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], true);
        expect(premium).toBe(160); // 100 + 50 + 30 - 20 + 10 - 15 + 5
    });
    it('handles multiple items and damages', () => {
        const premium = calculateQuote({ yearsWithMHPCO: 0 }, [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
            { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ]);
        expect(premium).toBe(231); // (100+50+60) = 210 + 16 first insurance + 5 fee
        const policy = {
            items: [
                { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
                { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
            ],
        };
        const result = calculateClaim(policy, [
            { itemType: 'sword', amount: 500 },
            { itemType: 'amulet', amount: 300 },
        ]);
        expect(result).toEqual({ payout: 600, remainingCap: 2600 });
    });
});
