import { describe, it, expect } from 'vitest';
import { calculateClaim } from './claim';
describe('calculateClaim', () => {
    describe('basic payout calculation', () => {
        it('should calculate payout with deductible', () => {
            const result = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 500 }],
            });
            // 500 - 100 (deductible) = 400
            // Cap is 2 * 1000 = 2000, remaining is 2000 - 400 = 1600
            expect(result).toEqual({ payout: 400, remainingCap: 1600 });
        });
        it('should apply deductible per damage event', () => {
            const result = calculateClaim({
                policy: {
                    items: [
                        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
                        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
                    ],
                    insuranceSum: 1600,
                },
                damages: [
                    { itemType: 'sword', amount: 500 },
                    { itemType: 'amulet', amount: 300 },
                ],
            });
            // Sword: 500 - 100 = 400
            // Amulet: 300 - 100 = 200
            // Total: 600, remaining cap: 2 * 1600 - 600 = 2600
            expect(result).toEqual({ payout: 600, remainingCap: 2600 });
        });
    });
    describe('high enchantment clause', () => {
        it('should apply 50% reduction for enchantment >= 8', () => {
            const result = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 1000 }],
            });
            // 1000 * 0.5 = 500, then - 100 (deductible) = 400
            expect(result).toEqual({ payout: 400, remainingCap: 1600 });
        });
        it('should not apply reduction for enchantment < 8', () => {
            const result = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 1000 }],
            });
            // 1000 - 100 (deductible) = 900
            expect(result).toEqual({ payout: 900, remainingCap: 1100 });
        });
    });
    describe('dragon material clause', () => {
        it('should fully reimburse dragon material items', () => {
            const result = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'dragon', enchantment: 3, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 800 }],
            });
            // Full reimbursement: 800 - 100 (deductible) = 700
            expect(result).toEqual({ payout: 700, remainingCap: 1300 });
        });
    });
    describe('clause priority', () => {
        it('should apply 50% reduction when both enchantment >= 8 and dragon material', () => {
            const result = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 1000 }],
            });
            // 50% reduction applies first: 1000 * 0.5 = 500, then - 100 = 400
            expect(result).toEqual({ payout: 400, remainingCap: 1600 });
        });
        it('should apply 50% reduction for enchantment >= 8 even with dragon material if enchantment is higher', () => {
            const result = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 1000 }],
            });
            // Both clauses apply; 50% rule wins: 1000 * 0.5 = 500, then - 100 = 400
            expect(result).toEqual({ payout: 400, remainingCap: 1600 });
        });
    });
    describe('cap enforcement', () => {
        it('should cap total payout at 2x insurance sum', () => {
            const result = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 3000 }],
            });
            // 3000 - 100 = 2900, but cap is 2000
            expect(result).toEqual({ payout: 2000, remainingCap: 0 });
        });
        it('should track remaining cap across claims', () => {
            // First claim
            const result1 = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 1500 }],
            });
            expect(result1).toEqual({ payout: 1400, remainingCap: 600 });
            // Second claim - simulating remaining cap from first
            const result2 = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
                    insuranceSum: 1000,
                    remainingCap: 600, // From first claim
                },
                damages: [{ itemType: 'sword', amount: 1500 }],
            });
            // 1500 - 100 = 1400, but remaining cap is only 600
            expect(result2).toEqual({ payout: 600, remainingCap: 0 });
        });
    });
    describe('rounding', () => {
        it('should round payout down', () => {
            const result = calculateClaim({
                policy: {
                    items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
                    insuranceSum: 1000,
                },
                damages: [{ itemType: 'sword', amount: 1000 }],
            });
            // 1000 * 0.5 = 500, then - 100 = 400 (no fractional part)
            expect(result.payout).toBe(400);
        });
    });
    describe('multiple items of same type', () => {
        it('should process each damage separately with its own deductible', () => {
            const result = calculateClaim({
                policy: {
                    items: [
                        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
                        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
                    ],
                    insuranceSum: 2000,
                },
                damages: [
                    { itemType: 'sword', amount: 500 },
                    { itemType: 'sword', amount: 500 },
                ],
            });
            // Each damage gets own deductible: (500 - 100) + (500 - 100) = 800
            expect(result).toEqual({ payout: 800, remainingCap: 3200 });
        });
    });
    describe('damage validation', () => {
        it('should reject negative damage amounts', () => {
            expect(() => {
                calculateClaim({
                    policy: {
                        items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
                        insuranceSum: 1000,
                    },
                    damages: [{ itemType: 'sword', amount: -200 }],
                });
            }).toThrow();
        });
        it('should reject damage for uninsured item types', () => {
            expect(() => {
                calculateClaim({
                    policy: {
                        items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
                        insuranceSum: 1000,
                    },
                    damages: [{ itemType: 'amulet', amount: 200 }],
                });
            }).toThrow();
        });
        it('should reject damage if count exceeds insured items', () => {
            expect(() => {
                calculateClaim({
                    policy: {
                        items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
                        insuranceSum: 1000,
                    },
                    damages: [
                        { itemType: 'sword', amount: 200 },
                        { itemType: 'sword', amount: 200 },
                    ],
                });
            }).toThrow();
        });
    });
});
