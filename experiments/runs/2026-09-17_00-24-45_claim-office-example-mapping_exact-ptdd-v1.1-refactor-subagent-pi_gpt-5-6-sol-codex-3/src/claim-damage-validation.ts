export function assertDamageAmountIsNonNegative(amount: number): void {
  if (amount < 0) throw new Error("Damage amount must not be negative");
}
