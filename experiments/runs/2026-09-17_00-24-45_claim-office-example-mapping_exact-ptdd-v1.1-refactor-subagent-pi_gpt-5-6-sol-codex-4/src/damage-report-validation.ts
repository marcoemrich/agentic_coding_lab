interface ReportedDamageAmount {
  amount: number;
}

export function validateDamageAmounts(damages: ReportedDamageAmount[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }
}
