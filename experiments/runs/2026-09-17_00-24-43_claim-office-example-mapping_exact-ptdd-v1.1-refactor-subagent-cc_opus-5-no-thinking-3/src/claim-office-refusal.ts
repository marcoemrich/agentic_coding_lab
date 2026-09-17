// The MHPCO refuses a scenario it cannot honour rather than quoting or
// settling it: an unquotable item, a damage the policy does not cover, a
// damage amount that makes no sense. A refusal is not a result -- the office
// abandons the whole scenario and reports why.
//
// This is the office's shared refusal vocabulary, so it lives on its own: the
// rules that raise a refusal sit in several places (the catalogue's
// admissibility, the settlement's coverage and damage checks), and none of
// them should have to depend on another just to name the refusal.

export class ClaimOfficeRefusal extends Error {}
