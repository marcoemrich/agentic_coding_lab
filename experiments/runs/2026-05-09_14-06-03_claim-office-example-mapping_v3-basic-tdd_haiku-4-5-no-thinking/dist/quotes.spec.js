import { describe, it, expect } from 'vitest';
import { calculateQuote } from './quotes';
describe('calculateQuote', () => {
    describe('base premiums with first insurance', () => {
        it('calculates premium for a sword', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
            expect(result).toBe(115); // 100 base + 10 first insurance + 5 processing fee
        });
        it('calculates premium for an amulet', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }]);
            expect(result).toBe(71); // 60 base + 6 first insurance + 5 processing fee
        });
        it('calculates premium for a staff', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'staff', material: 'wood', enchantment: 0, cursed: false }]);
            expect(result).toBe(93); // 80 base + 8 first insurance + 5 processing fee
        });
        it('calculates premium for a potion', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'potion', material: 'liquid', enchantment: 0, cursed: false }]);
            expect(result).toBe(49); // 40 base + 4 first insurance + 5 processing fee
        });
        it('calculates premium for components', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }]);
            expect(result).toBe(33); // 25 base + 2.5 first insurance + 5.5 processing fee = 32.5 rounds to 33
        });
    });
    describe('component building blocks', () => {
        it('applies no block to 2 runes', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
            ]);
            expect(result).toBe(60); // 50 base + 5 first insurance + 5 processing fee
        });
        it('applies block discount to exactly 3 alike components', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
            ]);
            expect(result).toBe(71); // 60 block base + 6 first insurance + 5 processing fee
        });
        it('no block for 4 runes', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
            ]);
            expect(result).toBe(115); // 100 base + 10 first insurance + 5 processing fee
        });
        it('applies blocks separately for different component types', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
                { type: 'moonstone', material: 'stone', enchantment: 0, cursed: false },
                { type: 'moonstone', material: 'stone', enchantment: 0, cursed: false },
                { type: 'moonstone', material: 'stone', enchantment: 0, cursed: false },
            ]);
            expect(result).toBe(137); // 120 (two blocks) + 12 first insurance + 5 processing fee
        });
    });
    describe('item-specific modifiers', () => {
        it('applies 50% curse surcharge to base premium', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }]);
            expect(result).toBe(165); // (100 + 50) base + 10 first insurance + 5 fee
        });
        it('applies 30% high enchantment surcharge for level >= 5', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }]);
            expect(result).toBe(145); // (100 + 30) base + 10 first insurance + 5 fee
        });
        it('applies both curse and enchantment surcharges', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }]);
            expect(result).toBe(195); // (100 + 50 + 30) base + 10 first insurance + 5 fee
        });
        it('does not apply enchantment surcharge for level < 5', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }]);
            expect(result).toBe(115); // 100 base + 10 first insurance + 5 fee
        });
    });
    describe('policy-wide modifiers', () => {
        it('applies 20% loyalty discount for 2+ years', () => {
            const result = calculateQuote({ yearsWithMHPCO: 2 }, [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]);
            expect(result).toBe(95); // 100 - 20 loyalty + 10 first insurance + 5 fee
        });
        it('applies 15% follow-up contract discount', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }], true);
            expect(result).toBe(100); // 100 - 15 follow-up + 10 first insurance + 5 fee
        });
        it('applies loyalty discount with follow-up contract', () => {
            const result = calculateQuote({ yearsWithMHPCO: 2 }, [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }], true);
            expect(result).toBe(80); // 100 - 20 loyalty - 15 follow-up + 10 first insurance + 5 fee
        });
    });
    describe('complex modifiers', () => {
        it('handles newcomer with cursed sword', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]);
            expect(result).toBe(165); // 100 + 50 curse + 10 first insurance + 5 fee
        });
        it('handles long-standing customer second contract', () => {
            const result = calculateQuote({ yearsWithMHPCO: 3 }, [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], true);
            expect(result).toBe(160); // 100 + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee
        });
        it('handles multiple items with different modifiers', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, [
                { type: 'sword', material: 'steel', enchantment: 0, cursed: true }, // 100 + 50
                { type: 'amulet', material: 'silver', enchantment: 0, cursed: false }, // 60
            ]);
            expect(result).toBe(231); // (100+50+60) = 210 base + 16 first insurance (10% of 160) + 5 fee
        });
    });
    describe('empty items', () => {
        it('returns only processing fee for empty items list', () => {
            const result = calculateQuote({ yearsWithMHPCO: 0 }, []);
            expect(result).toBe(5);
        });
    });
    describe('error handling', () => {
        it('throws for unknown item type', () => {
            expect(() => {
                calculateQuote({ yearsWithMHPCO: 0 }, [{ type: 'broomstick', material: 'wood', enchantment: 0, cursed: false }]);
            }).toThrow('Unknown item type: broomstick');
        });
    });
});
