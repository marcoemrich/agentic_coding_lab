/**
 * The customer whose standing with MHPCO the policy-wide modifiers are rated
 * against: how long they have been with the office, and how many contracts they
 * already hold.
 */
export interface Customer {
  readonly yearsWithMHPCO: number;
  readonly previousContracts: number;
}
