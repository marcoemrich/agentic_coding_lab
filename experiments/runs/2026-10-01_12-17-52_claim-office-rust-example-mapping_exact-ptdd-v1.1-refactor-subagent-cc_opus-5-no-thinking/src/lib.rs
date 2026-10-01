use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;

/// One damaged item reported in an incident.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Damage {
    pub item_type: String,
    pub amount: i64,
}

/// A damage report filed against an existing policy.
#[derive(Deserialize)]
pub struct Incident {
    pub damages: Vec<Damage>,
}

/// A scenario: the one customer the MHPCO deals with, and the steps they file.
#[derive(Deserialize)]
pub struct Scenario {
    pub customer: Customer,
    pub steps: Vec<Step>,
}

/// One operation the customer asks the MHPCO to perform.
#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "lowercase")]
pub enum Step {
    Quote {
        items: Vec<Item>,
    },
    Claim {
        /// Zero-based index of the quote step that created the policy.
        policy: usize,
        incident: Incident,
    },
}

/// What the MHPCO reports for one step of a scenario.
#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum StepResult {
    Quote {
        premium: u64,
    },
    #[serde(rename_all = "camelCase")]
    Claim {
        payout: u64,
        remaining_cap: u64,
    },
}

/// Why the MHPCO refuses to process a scenario at all.
#[derive(Debug)]
pub enum ScenarioError {
    /// The step a claim named as its policy is no quote step, so it wrote no
    /// policy the claim could be settled against.
    NoPolicyAtStep { step: usize },
    Quote(QuoteError),
    Claim(ClaimError),
}

impl std::fmt::Display for ScenarioError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NoPolicyAtStep { step } => {
                write!(formatter, "step {step} created no policy to claim against")
            }
            Self::Quote(error) => error.fmt(formatter),
            Self::Claim(error) => error.fmt(formatter),
        }
    }
}

/// Why the MHPCO refuses to quote a premium at all.
#[derive(Debug)]
pub enum QuoteError {
    /// The catalogue lists no item of this type.
    UnknownItemType { item_type: String },
}

impl std::fmt::Display for QuoteError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnknownItemType { item_type } => {
                write!(formatter, "the MHPCO does not insure a {item_type}")
            }
        }
    }
}

/// Why the MHPCO refuses to settle a claim at all.
#[derive(Debug)]
pub enum ClaimError {
    /// A damage was reported with a negative amount.
    NegativeDamageAmount { amount: i64 },
    /// The policy covers no item of this type at all.
    ItemNotInsured { item_type: String },
    /// More damages of this item type were reported than the policy covers.
    MoreDamagesThanInsuredItems { item_type: String },
}

impl std::fmt::Display for ClaimError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::NegativeDamageAmount { amount } => {
                write!(formatter, "a damage amount of {amount} is not a loss")
            }
            Self::ItemNotInsured { item_type } => {
                write!(formatter, "the damaged {item_type} is not insured by this policy")
            }
            Self::MoreDamagesThanInsuredItems { item_type } => write!(
                formatter,
                "more {item_type} damages were reported than the policy insures"
            ),
        }
    }
}

/// What the MHPCO settles on a claim: the payout and the cap left on the
/// policy afterwards.
#[derive(Debug)]
pub struct ClaimResult {
    pub payout: u64,
    pub remaining_cap: u64,
}

/// The single customer a scenario is quoted for.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Customer {
    #[serde(rename = "yearsWithMHPCO")]
    pub years_with_mhpco: u32,
}

#[derive(Deserialize)]
pub struct Item {
    #[serde(rename = "type")]
    pub item_type: String,
    /// The MHPCO records only `type` as given; an item submitted without a
    /// material, enchantment level or curse is insured as a plain item.
    #[serde(default)]
    pub material: String,
    #[serde(default)]
    pub enchantment: u32,
    #[serde(default)]
    pub cursed: bool,
}

const PROCESSING_FEE: u64 = 5;
const DEDUCTIBLE_PER_DAMAGE: u64 = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM: u64 = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL: u32 = 8;
const HALF_REIMBURSEMENT_PERCENT: u64 = 50;

const COMPONENT_INSURANCE_VALUE: u64 = 250;
const COMPONENT_BASE_PREMIUM: u64 = 25;
const COMPONENT_BLOCK_BASE_PREMIUM: u64 = 60;
const COMPONENT_BLOCK_SIZE: usize = 3;
const CURSE_SURCHARGE_PERCENT: u64 = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT: u64 = 30;
const HIGH_ENCHANTMENT_LEVEL: u32 = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT: u64 = 10;
const LOYALTY_DISCOUNT_PERCENT: u64 = 20;
const LOYALTY_YEARS: u32 = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT: u64 = 15;

/// Components, such as runes and moonstones, are the parts the MHPCO insures
/// alongside main items and the only items the building-block offer covers.
fn is_component(item: &Item) -> bool {
    matches!(item.item_type.as_str(), "rune" | "moonstone")
}

/// What the MHPCO price list says about one main item: the value it is insured
/// for and the base premium it costs to insure. The list states both figures on
/// one line per item, and the office never learns one without the other.
struct PriceListEntry {
    insurance_value: u64,
    base_premium: u64,
}

/// The MHPCO price list for main items, or nothing at all when the catalogue
/// does not list that type. This is the one place the roster of insurable main
/// items is written down: being listed here is what it means for the office to
/// insure a type.
fn price_list_entry(item_type: &str) -> Option<PriceListEntry> {
    let (insurance_value, base_premium) = match item_type {
        "sword" => (1000, 100),
        "amulet" => (600, 60),
        "staff" => (800, 80),
        "potion" => (400, 40),
        _ => return None,
    };
    Some(PriceListEntry {
        insurance_value,
        base_premium,
    })
}

/// The MHPCO insures the components it recognises and the main items its price
/// list names; it insures nothing else.
fn is_in_catalogue(item: &Item) -> bool {
    is_component(item) || price_list_entry(&item.item_type).is_some()
}

/// A reported damage must be a loss, never a negative amount.
fn check_every_damage_amount_is_a_loss(incident: &Incident) -> Result<(), ClaimError> {
    match incident.damages.iter().find(|damage| damage.amount < 0) {
        Some(negative) => Err(ClaimError::NegativeDamageAmount {
            amount: negative.amount,
        }),
        None => Ok(()),
    }
}

/// The MHPCO can only price the items its catalogue lists.
fn check_every_item_is_in_the_catalogue(items: &[Item]) -> Result<(), QuoteError> {
    match items.iter().find(|item| !is_in_catalogue(item)) {
        Some(unknown) => Err(QuoteError::UnknownItemType {
            item_type: unknown.item_type.clone(),
        }),
        None => Ok(()),
    }
}

/// The price-list line a main item is priced and insured by. The catalogue
/// guard has already refused anything the list does not name, so a main item
/// the office has accepted is always listed.
fn listed(item: &Item) -> PriceListEntry {
    price_list_entry(&item.item_type).expect("the catalogue lists this item type")
}

/// The base premium one insured item earns. Every component is priced alike;
/// a main item is priced by its price-list line.
fn base_premium(item: &Item) -> u64 {
    if is_component(item) {
        return COMPONENT_BASE_PREMIUM;
    }
    listed(item).base_premium
}

/// The building-block offer is reserved for a group of exactly 3 alike
/// components; a larger group does not qualify, it is priced per component.
fn qualifies_as_building_block(alike_component_count: usize) -> bool {
    alike_component_count == COMPONENT_BLOCK_SIZE
}

/// The price the MHPCO charges for one group of alike components: the
/// building-block offer when the group qualifies, otherwise per component.
fn component_group_base_premium(count: usize) -> u64 {
    if qualifies_as_building_block(count) {
        COMPONENT_BLOCK_BASE_PREMIUM
    } else {
        count as u64 * COMPONENT_BASE_PREMIUM
    }
}

/// How many entries fall under each key a list of items is grouped by. The
/// MHPCO tallies items this way wherever a rule counts like with like: the
/// claim side groups by catalogue type to match damages against cover, the
/// premium side by alike-group key to recognise a building block.
fn count_by_item_type<'a>(
    item_types: impl Iterator<Item = &'a str>,
) -> BTreeMap<&'a str, usize> {
    let mut counts: BTreeMap<&str, usize> = BTreeMap::new();
    for item_type in item_types {
        *counts.entry(item_type).or_insert(0) += 1;
    }
    counts
}

/// Two components are "alike" when they share this key. For the MHPCO,
/// alike means the very same catalogue type: a rune and a moonstone are
/// never alike, so mixed component types form no building block.
fn alike_group_key(item: &Item) -> &str {
    &item.item_type
}

/// The policy base premium: the sum of all insured items' base premiums,
/// with alike components priced per group so a block can be recognised.
fn policy_base_premium(items: &[Item]) -> u64 {
    let main_items_total: u64 = items
        .iter()
        .filter(|item| !is_component(item))
        .map(base_premium)
        .sum();

    let alike_component_groups = count_by_item_type(
        items
            .iter()
            .filter(|item| is_component(item))
            .map(alike_group_key),
    );

    main_items_total
        + alike_component_groups
            .values()
            .map(|count| component_group_base_premium(*count))
            .sum::<u64>()
}

/// Who owes an amount, which is what decides the direction the MHPCO rounds it.
#[derive(Clone, Copy)]
enum Debtor {
    Customer,
    Mhpco,
}

/// Every amount is rounded to whole G in the MHPCO's favor. That one rule
/// settles the direction by itself once it is known who owes whom: an amount
/// the customer owes is rounded up, an amount the office owes is rounded down.
/// Intermediate amounts stay fractional; only the final amount is rounded.
fn rounded_in_mhpco_favor(amount: f64, owed_by: Debtor) -> u64 {
    match owed_by {
        Debtor::Customer => amount.ceil() as u64,
        Debtor::Mhpco => amount.floor() as u64,
    }
}

/// A policy-wide modifier is measured against the policy base premium, the
/// sum of all item base premiums, never against a single item.
fn percent_of_policy_base(policy_base_premium: f64, percent: u64) -> f64 {
    policy_base_premium * percent as f64 / 100.0
}

/// Every item in a quote is treated as a first insurance, so the initial
/// assessment surcharge is charged on the whole policy base premium.
fn first_insurance_surcharge(policy_base_premium: f64) -> f64 {
    percent_of_policy_base(policy_base_premium, FIRST_INSURANCE_SURCHARGE_PERCENT)
}

/// The MHPCO charges a high-enchantment risk surcharge on items it considers
/// highly enchanted. This is the premium-side threshold; the claim-side
/// reimbursement clause judges enchantment by its own, stricter threshold.
fn is_highly_enchanted(item: &Item) -> bool {
    item.enchantment >= HIGH_ENCHANTMENT_LEVEL
}

/// An item-specific risk surcharge is charged on the base premium of the
/// affected item, never on the policy total.
fn risk_surcharge_on_base_premium(item: &Item, surcharge_percent: u64) -> f64 {
    base_premium(item) as f64 * surcharge_percent as f64 / 100.0
}

/// The risk surcharge one item carries. Risks the MHPCO recognises stack: an
/// item that brings two of them is surcharged for each.
fn item_risk_surcharge(item: &Item) -> f64 {
    let mut surcharge = 0.0;
    if item.cursed {
        surcharge += risk_surcharge_on_base_premium(item, CURSE_SURCHARGE_PERCENT);
    }
    if is_highly_enchanted(item) {
        surcharge += risk_surcharge_on_base_premium(item, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);
    }
    surcharge
}

/// Item-specific modifiers apply to the base premium of the affected item,
/// never to the policy total, so the policy owes the sum of the items' own
/// risk surcharges.
fn item_risk_surcharges(items: &[Item]) -> f64 {
    items.iter().map(item_risk_surcharge).sum()
}

/// A long-standing customer, with at least two years of business with the
/// MHPCO, has earned the loyalty discount.
fn is_long_standing(customer: &Customer) -> bool {
    customer.years_with_mhpco >= LOYALTY_YEARS
}

/// The loyalty discount is a policy-wide modifier, so it is measured against
/// the policy base premium.
fn loyalty_discount(customer: &Customer, policy_base_premium: f64) -> f64 {
    if is_long_standing(customer) {
        percent_of_policy_base(policy_base_premium, LOYALTY_DISCOUNT_PERCENT)
    } else {
        0.0
    }
}

/// A contract is a follow-up when the customer already holds at least one
/// other contract with the MHPCO; the customer's very first is not.
fn is_follow_up_contract(contracts_already_held: u32) -> bool {
    contracts_already_held > 0
}

/// Every contract after the customer's first earns the follow-up discount. It
/// is a policy-wide modifier, so it is measured against the policy base premium.
fn follow_up_contract_discount(contracts_already_held: u32, policy_base_premium: f64) -> f64 {
    if is_follow_up_contract(contracts_already_held) {
        percent_of_policy_base(policy_base_premium, FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT)
    } else {
        0.0
    }
}

/// What the customer's standing with the MHPCO adds to or takes off the policy
/// base premium: the net of every policy-wide surcharge and discount. Positive
/// amounts raise the premium, negative amounts lower it.
fn policy_wide_modifiers(
    customer: &Customer,
    contracts_already_held: u32,
    policy_base_premium: f64,
) -> f64 {
    first_insurance_surcharge(policy_base_premium)
        - loyalty_discount(customer, policy_base_premium)
        - follow_up_contract_discount(contracts_already_held, policy_base_premium)
}

/// The premium the policy earns before the processing fee: the policy base
/// premium, plus what the items' own risks cost, plus what the customer's
/// standing adjusts.
fn modified_policy_premium(
    customer: &Customer,
    contracts_already_held: u32,
    items: &[Item],
) -> f64 {
    let policy_base_premium = policy_base_premium(items) as f64;
    policy_base_premium
        + item_risk_surcharges(items)
        + policy_wide_modifiers(customer, contracts_already_held, policy_base_premium)
}

/// The MHPCO adds its processing fee to every premium at the very end, after
/// every surcharge and discount has been settled.
pub fn quote_premium(
    customer: &Customer,
    contracts_already_held: u32,
    items: &[Item],
) -> Result<u64, QuoteError> {
    check_every_item_is_in_the_catalogue(items)?;
    Ok(rounded_in_mhpco_favor(
        modified_policy_premium(customer, contracts_already_held, items) + PROCESSING_FEE as f64,
        Debtor::Customer,
    ))
}

/// Damage to a very highly enchanted item is reimbursed at only half the
/// damage amount. This claim-side threshold is deliberately stricter than, and
/// separate from, the premium-side high-enchantment risk surcharge: an item can
/// be enchanted enough to cost more to insure yet not enough to be halved.
fn is_reimbursed_by_half(item: &Item) -> bool {
    item.enchantment >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL
}

/// How much of a reported damage the MHPCO's reimbursement clauses cover,
/// before the deductible is taken off. Full reimbursement is the MHPCO's
/// standing position: it is both what an item with no clause receives and what
/// the dragon-material clause prescribes, so that clause asks for no share of
/// its own. Only the halving clause departs from full reimbursement, and it
/// wins wherever it applies.
fn covered_damage(damaged_item: &Item, damage: &Damage) -> f64 {
    if is_reimbursed_by_half(damaged_item) {
        damage.amount as f64 * HALF_REIMBURSEMENT_PERCENT as f64 / 100.0
    } else {
        damage.amount as f64
    }
}

/// The deductible applies per damage event, after the reimbursement clauses.
fn reimbursement_for(damaged_item: &Item, damage: &Damage) -> f64 {
    (covered_damage(damaged_item, damage) - DEDUCTIBLE_PER_DAMAGE as f64).max(0.0)
}

/// Which insured item a reported damage refers to. A damage names only a
/// catalogue type, so the policy is searched for an item of that type; the
/// reimbursement clauses are judged against the item found here, not the report.
fn insured_item_for<'a>(items: &'a [Item], damage: &Damage) -> &'a Item {
    items
        .iter()
        .find(|item| item.item_type == damage.item_type)
        .expect("the damaged item is insured by this policy")
}

/// What the MHPCO owes for an incident filed against a policy: the sum of the
/// reimbursements its damages earn, rounded in the office's favor at the end.
/// This is the tally inside a settlement, not an operation of its own: it knows
/// nothing of admissibility or of the cap, so only `claim` may speak for it.
fn claim_payout(items: &[Item], incident: &Incident) -> u64 {
    let total: f64 = incident
        .damages
        .iter()
        .map(|damage| reimbursement_for(insured_item_for(items, damage), damage))
        .sum();
    rounded_in_mhpco_favor(total, Debtor::Mhpco)
}

/// What one insured item is insured for. Every component is insured alike; a
/// main item is insured for the value its price-list line names.
fn insurance_value(item: &Item) -> u64 {
    if is_component(item) {
        return COMPONENT_INSURANCE_VALUE;
    }
    listed(item).insurance_value
}

/// The insurance sum of a policy is the sum of its items' insurance values.
fn insurance_sum(items: &[Item]) -> u64 {
    items.iter().map(insurance_value).sum()
}

/// The total payout per policy is capped at twice the insurance sum.
fn policy_cap(items: &[Item]) -> u64 {
    CAP_MULTIPLE_OF_INSURANCE_SUM * insurance_sum(items)
}

/// How the cap limits one settlement: the MHPCO pays what the incident earned,
/// but never more than the cap the policy has left, and reports the cap that
/// survives the payout.
fn settled_within_cap(earned: u64, available_cap: u64) -> ClaimResult {
    let payout = earned.min(available_cap);
    ClaimResult {
        payout,
        remaining_cap: available_cap - payout,
    }
}

/// How much of its cap a policy still has to pay out with, once earlier claims
/// have drawn on it. A cap can be drawn down until it is exhausted, and an
/// exhausted cap is simply nothing left, never a debt the policy owes back.
fn cap_remaining_on(items: &[Item], cap_already_consumed: u64) -> u64 {
    policy_cap(items).saturating_sub(cap_already_consumed)
}

/// How many items of a catalogue type a policy insures. A type the policy never
/// mentions is insured none of: the MHPCO holds no cover for what it did not
/// write down.
fn insured_count_of(insured_counts: &BTreeMap<&str, usize>, item_type: &str) -> usize {
    insured_counts.get(item_type).copied().unwrap_or(0)
}

/// Every reported damage must be covered by an insured item of its own. The
/// office compares the damages it was sent against the policy type by type, so a
/// type damaged twice needs two insured items of that type to stand. One
/// comparison decides admissibility; how far it falls short decides which
/// refusal the claim earns -- a type the policy does not cover at all is refused
/// as uninsured, a type covered by too few items as an over-count.
fn check_policy_covers_every_damage(
    items: &[Item],
    incident: &Incident,
) -> Result<(), ClaimError> {
    let insured = count_by_item_type(items.iter().map(|item| item.item_type.as_str()));
    for (item_type, reported) in
        count_by_item_type(incident.damages.iter().map(|damage| damage.item_type.as_str()))
    {
        let insured_of_that_type = insured_count_of(&insured, item_type);
        if insured_of_that_type == 0 {
            return Err(ClaimError::ItemNotInsured {
                item_type: item_type.to_string(),
            });
        }
        if reported > insured_of_that_type {
            return Err(ClaimError::MoreDamagesThanInsuredItems {
                item_type: item_type.to_string(),
            });
        }
    }
    Ok(())
}

/// What the MHPCO settles on an incident filed against a policy: what the
/// incident earns, limited by the cap the policy has left. The office first
/// satisfies itself that the claim is admissible at all; an inadmissible claim
/// is refused whole, and nothing is paid out on it.
pub fn claim(
    items: &[Item],
    incident: &Incident,
    cap_already_consumed: u64,
) -> Result<ClaimResult, ClaimError> {
    check_every_damage_amount_is_a_loss(incident)?;
    check_policy_covers_every_damage(items, incident)?;
    Ok(settled_within_cap(
        claim_payout(items, incident),
        cap_remaining_on(items, cap_already_consumed),
    ))
}

/// What the MHPCO has on record about a customer's dealings so far as it works
/// through their scenario: how many contracts they already hold, and how much
/// of each policy's cap earlier claims have already drawn down. Both are
/// written up as the office goes, and both are read back by later steps.
#[derive(Default)]
struct ScenarioLedger {
    contracts_already_held: u32,
    cap_consumed_by_policy: BTreeMap<usize, u64>,
}

impl ScenarioLedger {
    /// Every quote writes a new contract into the customer's record, so the
    /// next quote is one further along their history with the office.
    fn record_new_contract(&mut self) {
        self.contracts_already_held += 1;
    }

    /// How much of its cap a policy has already paid out on, before this claim.
    fn cap_consumed_by(&self, policy: usize) -> u64 {
        self.cap_consumed_by_policy.get(&policy).copied().unwrap_or(0)
    }

    /// A settled payout draws down the cap of the policy it was filed against,
    /// leaving that much less for the policy's later claims.
    fn record_payout_against(&mut self, policy: usize, payout: u64) {
        *self.cap_consumed_by_policy.entry(policy).or_insert(0) += payout;
    }
}

/// Steps are processed in order: each quote writes a policy a later claim can
/// refer to by its step index, and each claim draws down that policy's cap.
pub fn process_scenario(scenario: &Scenario) -> Result<Vec<StepResult>, ScenarioError> {
    let mut ledger = ScenarioLedger::default();
    scenario
        .steps
        .iter()
        .enumerate()
        .map(|(position, step)| process_step(scenario, position, step, &mut ledger))
        .collect()
}

/// What one step of a scenario earns, read against and written back into the
/// record the office keeps of the customer's dealings so far.
fn process_step(
    scenario: &Scenario,
    position: usize,
    step: &Step,
    ledger: &mut ScenarioLedger,
) -> Result<StepResult, ScenarioError> {
    match step {
        Step::Quote { items } => {
            let premium =
                quote_premium(&scenario.customer, ledger.contracts_already_held, items)
                    .map_err(ScenarioError::Quote)?;
            ledger.record_new_contract();
            Ok(StepResult::Quote { premium })
        }
        Step::Claim { policy, incident } => {
            let settled = claim(
                insured_items_of(scenario, *policy, position)?,
                incident,
                ledger.cap_consumed_by(*policy),
            )
            .map_err(ScenarioError::Claim)?;
            ledger.record_payout_against(*policy, settled.payout);
            Ok(StepResult::Claim {
                payout: settled.payout,
                remaining_cap: settled.remaining_cap,
            })
        }
    }
}

/// The items insured by the policy a quote step created. A claim names its
/// policy by the step index of the quote that wrote it, and only a quote step
/// already behind it speaks for a policy: the office searches the steps it has
/// worked through before this claim, so an index naming a claim step, one past
/// the end of the scenario, and one pointing at or ahead of the claim itself all
/// name no policy at all and the whole scenario is refused. The office would
/// rather refuse a claim it cannot place than settle it against nothing.
fn insured_items_of(
    scenario: &Scenario,
    policy: usize,
    claim_position: usize,
) -> Result<&[Item], ScenarioError> {
    let steps_already_processed = &scenario.steps[..claim_position];
    match steps_already_processed.get(policy) {
        Some(Step::Quote { items }) => Ok(items),
        _ => Err(ScenarioError::NoPolicyAtStep { step: policy }),
    }
}

/// The scenario the customer submits, as the schema's JSON document.
pub fn scenario_from_json(json: &str) -> Result<Scenario, serde_json::Error> {
    serde_json::from_str(json)
}

/// What the MHPCO reports, as the schema's `results` document.
pub fn results_to_json(results: &[StepResult]) -> Result<String, serde_json::Error> {
    #[derive(Serialize)]
    struct Report<'a> {
        results: &'a [StepResult],
    }
    serde_json::to_string(&Report { results })
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A customer with the given number of years of business with the MHPCO,
    /// the standing the loyalty discount is judged against.
    fn customer_of(years_with_mhpco: u32) -> Customer {
        Customer { years_with_mhpco }
    }

    /// A customer in their first year of business with the MHPCO.
    fn newcomer() -> Customer {
        customer_of(0)
    }

    /// A plain, unenchanted, uncursed item of the given catalogue type.
    fn plain(item_type: &str) -> Item {
        Item {
            item_type: item_type.to_string(),
            material: "steel".to_string(),
            enchantment: 0,
            cursed: false,
        }
    }

    /// How many contracts the customer already holds when a quote is made: the
    /// standing the follow-up contract discount is judged against. The very
    /// first contract earns no discount; every later one does.
    const FIRST_CONTRACT: u32 = 0;
    const SECOND_CONTRACT: u32 = 1;
    const THIRD_CONTRACT: u32 = 2;

    /// The premium the MHPCO quotes for a policy it can price. Every premium
    /// example below names a catalogued item, so the quote is always priced;
    /// the refusal channel is the subject of its own tests, not of these.
    fn premium_of(customer: &Customer, contracts_already_held: u32, items: &[Item]) -> u64 {
        quote_premium(customer, contracts_already_held, items).expect("the quote is priced")
    }

    /// A group of `count` alike components, the shape the building-block
    /// offer is judged against.
    fn alike(count: usize, item_type: &str) -> Vec<Item> {
        (0..count).map(|_| plain(item_type)).collect()
    }

    /// An incident reporting one damage per `(item type, amount)` pair, the
    /// shape a claim is filed as: the deductible is judged per damage entry,
    /// so each pair stands for one damage event.
    fn incident_of(damages: &[(&str, i64)]) -> Incident {
        Incident {
            damages: damages
                .iter()
                .map(|(item_type, amount)| Damage {
                    item_type: item_type.to_string(),
                    amount: *amount,
                })
                .collect(),
        }
    }

    /// What the MHPCO pays when a policy covering just `item` is hit by a
    /// single damage of `amount` to that item: the shape every reimbursement
    /// clause example is stated in, so each test shows only the item trait the
    /// clause turns on and the payout it earns.
    fn payout_for_single_damage(item: Item, amount: i64) -> u64 {
        let item_type = item.item_type.clone();
        claim_payout(&[item], &incident_of(&[(&item_type, amount)]))
    }

    /// How the MHPCO settles a claim: a payout and the cap the policy has left
    /// afterwards are one settlement, so a claim example states both together.
    fn assert_settles(result: &ClaimResult, payout: u64, remaining_cap: u64) {
        assert_eq!(result.payout, payout);
        assert_eq!(result.remaining_cap, remaining_cap);
    }

    // ---- Base premiums: price list (one test per catalogue entry) ----

    #[test]
    fn quotes_empty_item_list_as_processing_fee_only() {
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[]), 5);
    }

    #[test]
    fn quotes_plain_sword_base_premium_of_100() {
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[plain("sword")]), 115);
    }

    #[test]
    fn quotes_plain_amulet_base_premium_of_60() {
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[plain("amulet")]), 71);
    }

    #[test]
    fn quotes_plain_staff_base_premium_of_80() {
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[plain("staff")]), 93);
    }

    #[test]
    fn quotes_plain_potion_base_premium_of_40() {
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[plain("potion")]), 49);
    }

    #[test]
    fn quotes_single_rune_base_premium_of_25() {
        // 25 G base + 2.5 G first insurance = 27.5 G, + 5 G fee = 32.5 G,
        // rounded up in the MHPCO's favor.
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[plain("rune")]), 33);
    }

    #[test]
    fn quotes_single_moonstone_base_premium_of_25() {
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[plain("moonstone")]), 33);
    }

    // ---- Component blocks of 3 alike components ----

    #[test]
    fn quotes_two_runes_without_block_discount() {
        // 50 G base + 5 G first insurance + 5 G fee.
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &alike(2, "rune")), 60);
    }

    #[test]
    fn quotes_three_runes_as_one_block() {
        // Block base premium 60 G + 6 G first insurance + 5 G fee.
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &alike(3, "rune")), 71);
    }

    #[test]
    fn quotes_four_runes_without_block_discount() {
        // 100 G base + 10 G first insurance + 5 G fee: four runes exceed the
        // block size, so every rune is priced individually again.
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &alike(4, "rune")), 115);
    }

    #[test]
    fn quotes_seven_runes_without_block_discount() {
        // 175 G base + 17.5 G first insurance = 192.5 G, + 5 G fee = 197.5 G,
        // rounded up in the MHPCO's favor.
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &alike(7, "rune")), 198);
    }

    #[test]
    fn quotes_mixed_component_types_without_block_discount() {
        // No block: "alike" means the very same component type, so 2 runes and
        // 1 moonstone stay two separate groups, neither of size 3.
        // 75 G base + 7.5 G first insurance + 5 G fee = 87.5 G.
        let mut components = alike(2, "rune");
        components.extend(alike(1, "moonstone"));
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &components), 88);
    }

    #[test]
    fn quotes_two_component_blocks_of_different_types() {
        // Two separate blocks, 60 G each: 120 G base + 12 G + 5 G fee.
        let mut components = alike(3, "rune");
        components.extend(alike(3, "moonstone"));
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &components), 137);
    }

    // ---- Item-specific premium modifiers ----

    #[test]
    fn quotes_cursed_sword_with_curse_surcharge() {
        // 100 G base + 50 G curse + 10 G first insurance + 5 G fee.
        let cursed_sword = Item { cursed: true, ..plain("sword") };
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[cursed_sword]), 165);
    }

    #[test]
    fn quotes_high_enchantment_surcharge_at_level_five() {
        // 100 G base + 30 G high enchantment + 10 G first insurance + 5 G fee.
        let sword = Item { enchantment: 5, ..plain("sword") };
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[sword]), 145);
    }

    #[test]
    fn quotes_no_high_enchantment_surcharge_below_level_five() {
        // 100 G base + 10 G first insurance + 5 G fee, no risk surcharge.
        let sword = Item { enchantment: 4, ..plain("sword") };
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[sword]), 115);
    }

    #[test]
    fn quotes_curse_and_high_enchantment_surcharges_together() {
        // 100 G base + 50 G curse + 30 G high enchantment + 10 G first
        // insurance + 5 G fee.
        let sword = Item {
            cursed: true,
            enchantment: 5,
            ..plain("sword")
        };
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &[sword]), 195);
    }

    #[test]
    fn applies_item_modifiers_only_to_the_affected_item() {
        // Policy base 160 G; the curse adds 50 G (50 % of the cursed sword's
        // own base premium, not of the policy total) = 210 G, then 16 G first
        // insurance (10 % of the policy base premium) + 5 G fee.
        let items = [
            Item {
                cursed: true,
                ..plain("sword")
            },
            plain("amulet"),
        ];
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &items), 231);
    }

    // ---- Policy-wide premium modifiers ----

    #[test]
    fn quotes_first_insurance_surcharge_on_policy_base() {
        // Policy base 160 G + 16 G first insurance (10 % of the policy base
        // premium, not of a single item) + 5 G fee.
        let items = [plain("sword"), plain("amulet")];
        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, &items), 181);
    }

    #[test]
    fn quotes_loyalty_discount_at_exactly_two_years() {
        // 100 G base + 10 G first insurance - 20 G loyalty + 5 G fee.
        assert_eq!(premium_of(&customer_of(2), FIRST_CONTRACT, &[plain("sword")]), 95);
    }

    #[test]
    fn quotes_no_loyalty_discount_below_two_years() {
        // 100 G base + 10 G first insurance + 5 G fee, no loyalty discount.
        assert_eq!(premium_of(&customer_of(1), FIRST_CONTRACT, &[plain("sword")]), 115);
    }

    #[test]
    fn quotes_follow_up_contract_discount_on_second_quote() {
        // The customer already holds one contract, so this one is a follow-up:
        // 100 G base + 10 G first insurance - 15 G follow-up + 5 G fee.
        assert_eq!(
            premium_of(&newcomer(), SECOND_CONTRACT, &[plain("sword")]),
            100
        );
    }

    #[test]
    fn quotes_follow_up_contract_discount_on_every_later_contract() {
        // The discount applies to each contract after the first, not just the
        // second: 100 G base + 10 G - 15 G + 5 G fee.
        assert_eq!(
            premium_of(&newcomer(), THIRD_CONTRACT, &[plain("sword")]),
            100
        );
    }

    #[test]
    fn adds_processing_fee_after_all_modifiers() {
        // The discounts reduce the modified policy premium to 75 G; the 5 G fee
        // comes after them and is itself never discounted.
        assert_eq!(
            premium_of(&customer_of(2), SECOND_CONTRACT, &[plain("sword")]),
            80
        );
    }

    // ---- Rounding ----

    #[test]
    fn rounds_premium_up_to_whole_g() {
        // 7 runes compute 197.5 G exactly; the MHPCO rounds a premium up.
        let premium = premium_of(&newcomer(), FIRST_CONTRACT, &alike(7, "rune"));
        assert_eq!(premium, 198);
        assert_ne!(premium, 197);
    }

    #[test]
    fn keeps_intermediate_premium_amounts_fractional() {
        // Policy base 85 G (a rune block of 3 plus one moonstone). The
        // modifiers are individually fractional: +8.5 first insurance,
        // -17 loyalty, -12.75 follow-up, giving 63.75 G, + 5 G fee = 68.75 G,
        // rounded up once at the end. Truncating any intermediate amount
        // would lose the quarter G and yield 68 G.
        let mut items = alike(3, "rune");
        items.push(plain("moonstone"));
        assert_eq!(premium_of(&customer_of(2), SECOND_CONTRACT, &items), 69);
    }

    // ---- Integration examples ----

    #[test]
    fn quotes_newcomer_with_cursed_sword_as_165() {
        // Spec integration example: 0 years, no previous contract, cursed steel
        // sword at enchantment 3. 100 G base + 50 G curse + 10 G first
        // insurance = 160 G + 5 G fee = 165 G.
        let sword = Item {
            cursed: true,
            enchantment: 3,
            ..plain("sword")
        };
        assert_eq!(premium_of(&customer_of(0), FIRST_CONTRACT, &[sword]), 165);
    }

    #[test]
    fn quotes_long_standing_customers_second_contract_as_160() {
        // Spec integration example: 3 years with the MHPCO, second quote in the
        // scenario, cursed steel sword at enchantment 7. 100 G base + 50 G
        // curse + 30 G high enchantment - 20 G loyalty + 10 G first insurance
        // - 15 G follow-up contract = 155 G + 5 G fee = 160 G. The first
        // insurance surcharge still applies to the new sword even though the
        // customer is on a follow-up contract.
        let sword = Item {
            cursed: true,
            enchantment: 7,
            ..plain("sword")
        };
        assert_eq!(
            premium_of(&customer_of(3), SECOND_CONTRACT, &[sword]),
            160
        );
    }

    // ---- Claims: standard reimbursement and deductible ----

    #[test]
    fn pays_out_damage_minus_deductible_for_plain_item() {
        // Full reimbursement minus the 100 G deductible; no special clause
        // applies to a steel sword at enchantment 3.
        let sword = Item {
            enchantment: 3,
            ..plain("sword")
        };
        assert_eq!(payout_for_single_damage(sword, 500), 400);
    }

    #[test]
    fn pays_out_component_damage_minus_deductible() {
        // A rune has no enchantment level and no material, so no special clause
        // applies: full reimbursement minus the 100 G deductible.
        assert_eq!(payout_for_single_damage(plain("rune"), 200), 100);
    }

    #[test]
    fn pays_nothing_for_a_damage_below_the_deductible() {
        // The deductible applies per damage event, so a 50 G damage earns
        // nothing rather than reducing what another damage earns: the sword
        // damage still pays 400 G.
        let policy = [plain("sword"), plain("amulet")];
        let incident = incident_of(&[("amulet", 50), ("sword", 500)]);
        let result = claim(&policy, &incident, 0).expect("the claim is settled");
        assert_settles(&result, 400, 2800);
    }

    #[test]
    fn applies_deductible_once_per_damaged_item() {
        // A dragon attack damages two insured items; the 100 G deductible
        // applies once per damaged item: (500 - 100) + (300 - 100).
        let policy = [plain("sword"), plain("amulet")];
        let incident = incident_of(&[("sword", 500), ("amulet", 300)]);
        assert_eq!(claim_payout(&policy, &incident), 600);
    }

    // ---- Claims: special clauses ----

    #[test]
    fn halves_damage_above_enchantment_eight() {
        // Only the claim-side halving clause applies, judged by its own
        // threshold of 8 rather than the premium-side level of 5: 50 % first,
        // then the deductible: 500 - 100.
        let sword = Item {
            enchantment: 9,
            ..plain("sword")
        };
        assert_eq!(payout_for_single_damage(sword, 1000), 400);
    }

    #[test]
    fn does_not_halve_damage_below_enchantment_eight() {
        // Enchantment 7 is below the claim-side threshold, so the damage is
        // reimbursed in full less the deductible: 1000 - 100.
        let sword = Item {
            enchantment: 7,
            ..plain("sword")
        };
        assert_eq!(payout_for_single_damage(sword, 1000), 900);
    }

    #[test]
    fn fully_reimburses_dragon_material_item() {
        // Only the dragon-material clause applies: full reimbursement, then
        // the deductible: 800 - 100.
        let sword = Item {
            material: "dragon".to_string(),
            enchantment: 5,
            ..plain("sword")
        };
        assert_eq!(payout_for_single_damage(sword, 800), 700);
    }

    #[test]
    fn halves_damage_for_dragon_material_item_at_enchantment_eight() {
        // Both clauses apply at exactly enchantment 8; the 50 % rule wins,
        // then the deductible: 500 - 100.
        let sword = Item {
            material: "dragon".to_string(),
            enchantment: 8,
            ..plain("sword")
        };
        assert_eq!(payout_for_single_damage(sword, 1000), 400);
    }

    #[test]
    fn prefers_high_enchantment_clause_over_dragon_material() {
        // Both clauses apply; the 50 % rule wins over full dragon-material
        // reimbursement, then the deductible: 500 - 100.
        let sword = Item {
            material: "dragon".to_string(),
            enchantment: 9,
            ..plain("sword")
        };
        assert_eq!(payout_for_single_damage(sword, 1000), 400);
    }

    #[test]
    fn rounds_payout_down_to_whole_g() {
        // The halving clause covers 450.5 G of a 901 G damage; less the 100 G
        // deductible that is 350.5 G, and the MHPCO rounds a payout down.
        let sword = Item {
            enchantment: 9,
            ..plain("sword")
        };
        assert_eq!(payout_for_single_damage(sword, 901), 350);
    }

    // ---- Insurance sum and cap ----

    #[test]
    fn caps_payout_at_twice_the_insurance_sum() {
        // A sword's insurance sum is 1000 G, so the policy cap is 2000 G. A
        // 1500 G damage pays 1400 G and leaves 600 G of cap.
        let result = claim(&[plain("sword")], &incident_of(&[("sword", 1500)]), 0).expect("the claim is settled");
        assert_settles(&result, 1400, 600);
    }

    #[test]
    fn sums_insurance_values_of_all_items_for_the_cap() {
        // Insurance sum 1600 G (= 1000 sword + 600 amulet), so the cap is
        // 3200 G. A 1000 G sword damage pays 900 G and leaves 2300 G.
        let policy = [plain("sword"), plain("amulet")];
        let result = claim(&policy, &incident_of(&[("sword", 1000)]), 0).expect("the claim is settled");
        assert_settles(&result, 900, 2300);
    }

    #[test]
    fn insures_a_staff_for_800_and_a_potion_for_400() {
        // The price list gives a staff 800 G and a potion 400 G insurance
        // value, so a staff-and-potion policy has an insurance sum of 1200 G
        // and a cap of 2400 G. A 1000 G staff damage pays 900 G.
        let policy = [plain("staff"), plain("potion")];
        let result = claim(&policy, &incident_of(&[("staff", 1000)]), 0)
            .expect("the claim is settled");
        assert_settles(&result, 900, 1500);
    }

    #[test]
    fn sums_insurance_values_of_repeated_item_types() {
        // Two swords: insurance sum 2000 G (= 2 x 1000), cap 4000 G. A 1000 G
        // damage pays 900 G and leaves 3100 G.
        let policy = [plain("sword"), plain("sword")];
        let result = claim(&policy, &incident_of(&[("sword", 1000)]), 0).expect("the claim is settled");
        assert_settles(&result, 900, 3100);
    }

    #[test]
    fn excludes_block_discount_from_the_insurance_sum() {
        // Insurance sum 1750 G (= 1000 sword + 3 x 250 runes); the block
        // discount reduces the premium only, never the insurance sum. The cap
        // is 3500 G, so a 1000 G sword damage pays 900 G and leaves 2600 G.
        let mut policy = vec![plain("sword")];
        policy.extend(alike(3, "rune"));
        let result = claim(&policy, &incident_of(&[("sword", 1000)]), 0).expect("the claim is settled");
        assert_settles(&result, 900, 2600);
    }

    #[test]
    fn excludes_premium_modifiers_from_the_cap() {
        // The curse raises the premium to 165 G but the cap stays 2000 G,
        // based on the unmodified insurance value of 1000 G.
        let cursed_sword = Item {
            cursed: true,
            ..plain("sword")
        };
        let policy = std::slice::from_ref(&cursed_sword);

        assert_eq!(premium_of(&newcomer(), FIRST_CONTRACT, policy), 165);
        assert_settles(
            &claim(policy, &incident_of(&[("sword", 1500)]), 0).expect("the claim is settled"),
            1400,
            600,
        );
    }

    #[test]
    fn exhausts_the_cap_across_successive_claims() {
        // Cap 2000 G. The first claim pays 1400 G and leaves 600 G; the second
        // claim wants 1400 G again but is reduced to the remaining cap.
        let policy = [plain("sword")];
        let incident = incident_of(&[("sword", 1500)]);

        let first = claim(&policy, &incident, 0).expect("the claim is settled");
        assert_settles(&first, 1400, 600);

        let second = claim(&policy, &incident, first.payout).expect("the claim is settled");
        assert_settles(&second, 600, 0);
    }

    // ---- Multiple items of the same type ----

    #[test]
    fn treats_each_damage_entry_of_the_same_type_separately() {
        // Two swords insured, two sword damage entries: each entry is its own
        // damage with its own deductible, so 2 x (500 - 100).
        let policy = [plain("sword"), plain("sword")];
        let incident = incident_of(&[("sword", 500), ("sword", 500)]);
        let result = claim(&policy, &incident, 0).expect("the claim is settled");
        assert_settles(&result, 800, 3200);
    }

    #[test]
    fn rejects_more_damage_entries_than_insured_items_of_that_type() {
        // Two sword damages but only one sword insured: the whole claim is
        // rejected. The library reports an Err describing the offending type;
        // the CLI turns that into a non-zero exit and a stderr description.
        let policy = [plain("sword")];
        let incident = incident_of(&[("sword", 500), ("sword", 500)]);
        let error = claim(&policy, &incident, 0).expect_err("claim must be rejected");
        assert!(error.to_string().contains("sword"));
    }

    // ---- Error contracts (observable reading: scenario processing returns an Err; CLI exits non-zero, writes stderr, no stdout results) ----

    #[test]
    fn rejects_quote_with_unknown_item_type() {
        // The MHPCO cannot price an item its catalogue does not list, so the
        // quote is refused with a description naming the unknown type.
        let error = quote_premium(&newcomer(), FIRST_CONTRACT, &[plain("broomstick")])
            .expect_err("quote must be rejected");
        let description = error.to_string();
        assert!(description.contains("broomstick"), "{description}");
    }

    #[test]
    fn rejects_claim_for_an_item_outside_the_policy() {
        // An amulet is damaged but only a sword is insured. This is a distinct
        // refusal from an over-count: the item is not covered at all, so the
        // description says it is not insured rather than blaming the number of
        // reported damages.
        let policy = [plain("sword")];
        let incident = incident_of(&[("amulet", 300)]);
        let error = claim(&policy, &incident, 0).expect_err("claim must be rejected");
        let description = error.to_string();
        assert!(description.contains("amulet"), "{description}");
        assert!(description.contains("not insured"), "{description}");
    }

    #[test]
    fn rejects_claim_with_unknown_damaged_item_type() {
        // The specification groups an unknown damaged type with an item outside
        // the policy under one outcome, and gives no distinct description for
        // it. A policy cannot insure a type the catalogue does not list, so the
        // claim is refused as not insured.
        let policy = [plain("sword")];
        let incident = incident_of(&[("broomstick", 300)]);
        let error = claim(&policy, &incident, 0).expect_err("claim must be rejected");
        let description = error.to_string();
        assert!(description.contains("broomstick"), "{description}");
        assert!(description.contains("not insured"), "{description}");
    }

    #[test]
    fn rejects_claim_with_negative_damage_amount() {
        // A damage cannot be negative; the MHPCO refuses the claim rather than
        // treating it as no damage at all.
        let policy = [plain("sword")];
        let incident = incident_of(&[("sword", -200)]);
        let error = claim(&policy, &incident, 0).expect_err("claim must be rejected");
        let description = error.to_string();
        assert!(description.contains("-200"), "{description}");
    }

    // ---- Scenario / CLI contract ----

    #[test]
    fn returns_one_result_per_step_in_order() {
        // One result per step, in the steps' own order: the quote's premium
        // first, then the claim's settlement.
        let scenario = Scenario {
            customer: newcomer(),
            steps: vec![
                Step::Quote {
                    items: vec![plain("sword")],
                },
                Step::Claim {
                    policy: 0,
                    incident: incident_of(&[("sword", 500)]),
                },
            ],
        };
        let results = process_scenario(&scenario).expect("the scenario is processed");
        assert_eq!(results.len(), 2);
        assert!(matches!(results[0], StepResult::Quote { premium: 115 }));
        assert!(matches!(
            results[1],
            StepResult::Claim {
                payout: 400,
                remaining_cap: 1600
            }
        ));
    }

    #[test]
    fn processes_the_schema_example_scenario() {
        // The specification's schema example: a 5-year customer quotes a silver
        // amulet (enchantment 2), then claims 200 G against it.
        // Premium: 60 base + 6 first insurance - 12 loyalty + 5 fee = 59 G.
        // Claim: 200 - 100 deductible = 100 G; cap 1200 G, so 1100 G remains.
        let amulet = Item {
            material: "silver".to_string(),
            enchantment: 2,
            ..plain("amulet")
        };
        let scenario = Scenario {
            customer: customer_of(5),
            steps: vec![
                Step::Quote {
                    items: vec![amulet],
                },
                Step::Claim {
                    policy: 0,
                    incident: incident_of(&[("amulet", 200)]),
                },
            ],
        };
        let results = process_scenario(&scenario).expect("the scenario is processed");
        assert!(matches!(results[0], StepResult::Quote { premium: 59 }));
        assert!(matches!(
            results[1],
            StepResult::Claim {
                payout: 100,
                remaining_cap: 1100
            }
        ));
    }

    #[test]
    fn resolves_the_policy_by_zero_based_step_index() {
        // The claim names step 0, so it settles against the sword policy
        // (cap 2000 G) and not against the later amulet policy.
        let scenario = Scenario {
            customer: newcomer(),
            steps: vec![
                Step::Quote {
                    items: vec![plain("sword")],
                },
                Step::Quote {
                    items: vec![plain("amulet")],
                },
                Step::Claim {
                    policy: 0,
                    incident: incident_of(&[("sword", 500)]),
                },
            ],
        };
        let results = process_scenario(&scenario).expect("the scenario is processed");
        assert!(matches!(
            results[2],
            StepResult::Claim {
                payout: 400,
                remaining_cap: 1600
            }
        ));
    }

    #[test]
    fn rejects_a_claim_referring_to_a_later_quote_step() {
        // A claim refers to a policy created by an EARLIER quote step, so a
        // forward reference names no policy yet.
        let scenario = Scenario {
            customer: newcomer(),
            steps: vec![
                Step::Claim {
                    policy: 1,
                    incident: incident_of(&[("sword", 500)]),
                },
                Step::Quote {
                    items: vec![plain("sword")],
                },
            ],
        };
        let error = process_scenario(&scenario).expect_err("scenario must be rejected");
        let description = error.to_string();
        assert!(description.contains("step 1"), "{description}");
        assert!(description.contains("no policy"), "{description}");
    }

    #[test]
    fn rejects_a_claim_whose_policy_index_names_no_earlier_quote() {
        // A claim must refer to a policy an earlier quote step created. An
        // index naming another claim step names no policy at all, so the
        // scenario is refused rather than settled against nothing.
        let scenario = Scenario {
            customer: newcomer(),
            steps: vec![
                Step::Claim {
                    policy: 0,
                    incident: incident_of(&[("sword", 500)]),
                },
                Step::Claim {
                    policy: 0,
                    incident: incident_of(&[("sword", 500)]),
                },
            ],
        };
        // The refusal must name the bad policy reference, not blame the item:
        // an "item not insured" message would hide the real defect.
        let error = process_scenario(&scenario).expect_err("scenario must be rejected");
        let description = error.to_string();
        assert!(description.contains("step 0"), "{description}");
        assert!(description.contains("no policy"), "{description}");
    }

    #[test]
    fn defaults_the_optional_item_properties() {
        // The schema requires only `type` on an item. An item given without a
        // material, enchantment or curse is a plain item: a sword quoted that
        // way costs 115 G, as if it were steel, unenchanted and uncursed.
        let stdin = r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "sword"}]}]
        }"#;
        let scenario = scenario_from_json(stdin).expect("the scenario parses");
        let results = process_scenario(&scenario).expect("the scenario is processed");
        assert!(matches!(results[0], StepResult::Quote { premium: 115 }));
    }

    #[test]
    fn serializes_results_as_json_with_a_results_array() {
        // The schema example, over the wire: the binding field names on the way
        // in, and a `results` array in step order on the way out.
        let stdin = r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
                ]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}]
                }}
            ]
        }"#;
        let scenario = scenario_from_json(stdin).expect("the scenario parses");
        let results = process_scenario(&scenario).expect("the scenario is processed");
        let stdout = results_to_json(&results).expect("the results serialize");
        assert_eq!(
            stdout,
            r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
        );
    }
}
