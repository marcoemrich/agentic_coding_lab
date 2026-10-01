//! The office's running file on a customer: the business already done for
//! them in this scenario, and how a later step refers back to it.
//!
//! This is the MHPCO's filing rule, not a price or a settlement. It changes
//! when the office revises how business is recorded and referred back to -- a
//! claim naming a policy number rather than the step that opened it, a
//! customer's standing counted over contracts rather than quotes, a policy
//! file that outlives the scenario -- independently of what the office charges
//! for a quote and of what it settles on a claim.

use crate::Policy;

/// What the office has on file for this customer so far.
///
/// The step index a claim names is the office's own reference into this file,
/// so the file is what knows it: every step is recorded as it is answered,
/// and only a step that opened a policy can be referred back to.
pub(crate) struct BusinessDone {
    /// One entry per step answered so far, in order; `Some` for a step that
    /// opened a policy, `None` for a step that did not.
    opened_by_step: Vec<Option<Policy>>,
}

impl BusinessDone {
    /// A customer the office has not yet done business with in this scenario.
    pub(crate) fn none_yet() -> Self {
        BusinessDone {
            opened_by_step: Vec::new(),
        }
    }

    /// How many quotes the office has already given this customer, which is
    /// what decides whether the next one is a follow-up contract.
    pub(crate) fn quotes_given(&self) -> usize {
        self.opened_by_step.iter().flatten().count()
    }

    /// Record a step the office has answered, with the policy it opened if
    /// it opened one. Every step is recorded, opening or not, because the
    /// reference a claim uses is the step's own position in the scenario.
    pub(crate) fn record(&mut self, opened: Option<Policy>) {
        self.opened_by_step.push(opened);
    }

    /// The policy a step opened, as a later claim refers back to it. The
    /// office has no such policy on file if that step never opened one, or if
    /// it has not answered that step at all.
    pub(crate) fn policy_opened_at(&mut self, step: usize) -> Option<&mut Policy> {
        self.opened_by_step.get_mut(step)?.as_mut()
    }
}
