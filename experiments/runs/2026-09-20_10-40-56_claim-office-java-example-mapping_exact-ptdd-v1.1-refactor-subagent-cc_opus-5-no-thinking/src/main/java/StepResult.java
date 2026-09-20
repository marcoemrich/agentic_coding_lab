/**
 * What the MHPCO records for one settled step of a scenario.
 */
sealed interface StepResult permits QuoteResult, ClaimResult {
}
