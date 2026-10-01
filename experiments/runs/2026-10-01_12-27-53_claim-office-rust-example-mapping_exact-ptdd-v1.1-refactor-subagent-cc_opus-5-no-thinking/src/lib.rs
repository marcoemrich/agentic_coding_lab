pub struct Customer {
    years_with_mhpco: u32,
}

impl Customer {
    pub fn new(years_with_mhpco: u32) -> Self {
        Self { years_with_mhpco }
    }

    /// A long-standing customer has done business with the MHPCO for years.
    fn is_long_standing(&self) -> bool {
        self.years_with_mhpco >= LOYALTY_YEARS
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ItemType {
    Sword,
    Amulet,
    Staff,
    Potion,
    Rune,
    Moonstone,
}

impl ItemType {
    /// Every item type the MHPCO insures. The office's vocabulary is exactly the
    /// names of these types, so listing them once is what lets `parse` accept a
    /// claimant's name and `name` cite it back without a second list to keep in
    /// step.
    const INSURED: [Self; 6] = [
        Self::Sword,
        Self::Amulet,
        Self::Staff,
        Self::Potion,
        Self::Rune,
        Self::Moonstone,
    ];

    /// A component -- for example a rune or a moonstone -- rather than a main
    /// item. The MHPCO records no curse, enchantment or material for a
    /// component, and charges it per group of alike ones instead of giving it
    /// its own price-list row.
    fn is_component(self) -> bool {
        matches!(self, Self::Rune | Self::Moonstone)
    }

    /// The MHPCO price-list row for a main item, or `None` for a component:
    /// components are not on the main price list, they are charged per group of
    /// alike ones by `component_charge`.
    fn main_item_base_premium(self) -> Option<f64> {
        match self {
            Self::Sword => Some(100.0),
            Self::Amulet => Some(60.0),
            Self::Staff => Some(80.0),
            Self::Potion => Some(40.0),
            Self::Rune | Self::Moonstone => None,
        }
    }

    /// The MHPCO insures each item at its price-list insurance value. This is a
    /// separate price-list column from `main_item_base_premium`: the MHPCO reads
    /// the two independently, so a premium offer such as the component block
    /// discount moves one and leaves the other untouched.
    fn insurance_value(self) -> u64 {
        match self {
            Self::Sword => 1000,
            Self::Amulet => 600,
            Self::Staff => 800,
            Self::Potion => 400,
            Self::Rune | Self::Moonstone => COMPONENT_INSURANCE_VALUE,
        }
    }

    /// What the MHPCO calls this item type -- the office's whole vocabulary,
    /// stated once here. The office reads and writes it: `parse` accepts a
    /// claimant's name by matching it against these, and a notice the office sends
    /// back cites the item type by the same name.
    fn name(self) -> &'static str {
        match self {
            Self::Sword => "sword",
            Self::Amulet => "amulet",
            Self::Staff => "staff",
            Self::Potion => "potion",
            Self::Rune => "rune",
            Self::Moonstone => "moonstone",
        }
    }

    /// The item type the MHPCO recognises under this name, or a refusal: the
    /// office insures only the types on its price list, so a name it does not
    /// call any of them by names nothing it insures.
    pub fn parse(name: &str) -> Result<Self, String> {
        Self::INSURED
            .into_iter()
            .find(|insured| insured.name() == name)
            .ok_or_else(|| format!("the MHPCO does not insure items of type '{name}'"))
    }
}

#[derive(Clone)]
pub struct Item {
    item_type: ItemType,
    cursed: bool,
    enchantment: u32,
    material: String,
}

impl Item {
    pub fn new(item_type: ItemType) -> Self {
        Self {
            item_type,
            cursed: false,
            enchantment: 0,
            material: String::new(),
        }
    }

    /// The material the MHPCO recorded for this item.
    pub fn of_material(mut self, material: &str) -> Self {
        self.material = material.to_owned();
        self
    }

    /// The item's enchantment level, as recorded by the MHPCO.
    pub fn with_enchantment(mut self, enchantment: u32) -> Self {
        self.enchantment = enchantment;
        self
    }

    /// Whether the MHPCO recorded a curse on this item. A cursed item carries the
    /// office's risk surcharge.
    pub fn cursed(mut self, cursed: bool) -> Self {
        self.cursed = cursed;
        self
    }

    /// The item-specific risk surcharges this item carries, charged against the
    /// item's own base premium rather than the policy total. A component carries
    /// none: the MHPCO records no curse, enchantment or material for one, so it
    /// is never an affected item.
    fn item_surcharge(&self) -> f64 {
        self.item_type
            .main_item_base_premium()
            .map_or(0.0, |item_base| item_base * self.risk_surcharge_rate())
    }

    /// Highly enchanted for rating purposes. The MHPCO reads a separate, higher
    /// enchantment threshold when reimbursing damage, so this one is named for
    /// the premium it surcharges.
    fn is_highly_enchanted(&self) -> bool {
        self.enchantment >= HIGH_ENCHANTMENT_LEVEL
    }

    /// The share of a damage amount the MHPCO reimburses for this item, under the
    /// reimbursement clauses it reads today. Only one clause reduces the share:
    /// damage to a very highly enchanted item is reimbursed at half. That
    /// enchantment threshold is a higher one than the threshold that surcharges
    /// the premium, and the MHPCO reads the two independently -- the level and the
    /// share, though, are the one clause, so they are read together here.
    ///
    /// The MHPCO's other reimbursement clause -- dragon material is reimbursed in
    /// full -- deliberately has no branch here. Full reimbursement is already what
    /// an item under no clause receives, and the half-reimbursement clause wins
    /// wherever both apply, so the dragon clause cannot move any share the MHPCO
    /// recognises. The material stays a recorded property of the item; give it a
    /// branch only when a clause makes it change a share.
    fn reimbursement_share(&self) -> f64 {
        if self.enchantment >= HALF_REIMBURSEMENT_LEVEL {
            HALF_REIMBURSEMENT
        } else {
            FULL_REIMBURSEMENT
        }
    }

    /// Curse and high enchantment are independent risks; an item carrying both
    /// is surcharged for both.
    fn risk_surcharge_rate(&self) -> f64 {
        let curse = if self.cursed { CURSE_SURCHARGE } else { 0.0 };
        let enchantment = if self.is_highly_enchanted() {
            HIGH_ENCHANTMENT_SURCHARGE
        } else {
            0.0
        };
        curse + enchantment
    }
}

const PROCESSING_FEE: u64 = 5;
const FIRST_INSURANCE_SURCHARGE: f64 = 0.10;
/// Cursed items add a risk surcharge on their own base premium.
const CURSE_SURCHARGE: f64 = 0.50;
/// Long-standing customers -- 2 or more years of business with the MHPCO --
/// receive a loyalty discount on the policy base premium.
const LOYALTY_YEARS: u32 = 2;
const LOYALTY_DISCOUNT: f64 = 0.20;
/// Customers receive a discount on each contract after their first.
const FOLLOW_UP_CONTRACT_DISCOUNT: f64 = 0.15;
/// Highly enchanted items -- enchantment level 5 or above -- add a risk
/// surcharge on their own base premium.
const HIGH_ENCHANTMENT_LEVEL: u32 = 5;
const HIGH_ENCHANTMENT_SURCHARGE: f64 = 0.30;
/// Components -- for example runes and moonstones -- share one price-list row.
const COMPONENT_BASE_PREMIUM: f64 = 25.0;

/// How the MHPCO settles a rated premium into the amount it bills: the rated
/// fraction is rounded in the MHPCO's own favour -- upwards, the larger amount
/// -- and the processing fee is added to every premium at the very end.
fn settled_premium(rated: f64) -> u64 {
    rated.ceil() as u64 + PROCESSING_FEE
}

/// The policy-wide modifier rate, charged against the policy base premium --
/// the sum of all item base premiums. The MHPCO nets its policy-wide modifiers
/// against one another: a first insurance carries an initial assessment
/// surcharge, a long-standing customer earns a loyalty discount, and every
/// contract after the customer's first earns a follow-up discount.
fn policy_modifier_rate(customer: &Customer, contract: Contract) -> f64 {
    let loyalty = if customer.is_long_standing() {
        LOYALTY_DISCOUNT
    } else {
        0.0
    };
    let follow_up = match contract {
        Contract::First => 0.0,
        Contract::FollowUp => FOLLOW_UP_CONTRACT_DISCOUNT,
    };
    FIRST_INSURANCE_SURCHARGE - loyalty - follow_up
}

/// A building block of exactly 3 alike components is offered at this price
/// instead of the per-component base premium.
const COMPONENT_BLOCK_SIZE: usize = 3;
const COMPONENT_BLOCK_BASE_PREMIUM: f64 = 60.0;

fn component_charge(alike_count: usize) -> f64 {
    if alike_count == COMPONENT_BLOCK_SIZE {
        COMPONENT_BLOCK_BASE_PREMIUM
    } else {
        alike_count as f64 * COMPONENT_BASE_PREMIUM
    }
}

/// The policy's components gathered into groups of alike ones, each group
/// reported as its size. Alike components are the ones charged together, so the
/// MHPCO's reading of "alike" -- same item type -- lives here and nowhere else.
fn alike_component_groups(items: &[Item]) -> Vec<usize> {
    let mut groups: Vec<(ItemType, usize)> = Vec::new();
    for component in items.iter().filter(|item| item.item_type.is_component()) {
        match groups
            .iter_mut()
            .find(|(group_type, _)| *group_type == component.item_type)
        {
            Some((_, count)) => *count += 1,
            None => groups.push((component.item_type, 1)),
        }
    }
    groups.into_iter().map(|(_, count)| count).collect()
}

/// Main items are charged one price-list row each, individually.
fn main_items_base_premium(items: &[Item]) -> f64 {
    items
        .iter()
        .filter_map(|item| item.item_type.main_item_base_premium())
        .sum()
}

/// Components are charged per group of alike components, so that a group of
/// exactly 3 earns the block price.
fn component_blocks_base_premium(items: &[Item]) -> f64 {
    alike_component_groups(items)
        .into_iter()
        .map(component_charge)
        .sum()
}

/// The policy base premium is the sum of the items' base premiums, with alike
/// components charged as blocks. This is an intermediate rating amount the MHPCO
/// works from, not an amount it quotes: it is unrounded and carries no
/// processing fee, so it stays inside the office. What the office publishes is
/// `quote`.
fn policy_base_premium(items: &[Item]) -> f64 {
    main_items_base_premium(items) + component_blocks_base_premium(items)
}

/// Item-specific modifiers apply to the base premium of the affected item, not
/// to the policy total.
fn item_surcharges(items: &[Item]) -> f64 {
    items.iter().map(Item::item_surcharge).sum()
}

/// A customer's first contract with the MHPCO, or any contract after it.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Contract {
    First,
    FollowUp,
}

/// What the MHPCO rates this policy at, as an exact fraction: the policy base
/// premium, modified policy-wide for the customer and the contract, plus the
/// surcharges carried by the individual affected items. This is the rating
/// decision; it is deliberately unrounded and carries no processing fee.
fn rated_premium(customer: &Customer, items: &[Item], contract: Contract) -> f64 {
    let policy_base = policy_base_premium(items);
    policy_base + policy_base * policy_modifier_rate(customer, contract) + item_surcharges(items)
}

/// The premium the customer is billed: the MHPCO rates the policy, then settles
/// the rated amount into the amount billed.
pub fn quote(customer: &Customer, items: &[Item], contract: Contract) -> u64 {
    settled_premium(rated_premium(customer, items, contract))
}

/// Damage to an item enchanted at this level or above is reimbursed at half.
const HALF_REIMBURSEMENT_LEVEL: u32 = 8;
const HALF_REIMBURSEMENT: f64 = 0.50;
const FULL_REIMBURSEMENT: f64 = 1.0;

/// Components are insured at this value each.
const COMPONENT_INSURANCE_VALUE: u64 = 250;

/// The total payout per policy is capped at this multiple of its insurance sum.
const CAP_MULTIPLE: u64 = 2;

/// A deductible applies per damage event, once for each damaged item.
const DEDUCTIBLE_PER_DAMAGE: f64 = 100.0;

/// A single damaged item reported in an incident.
pub struct Damage {
    item_type: ItemType,
    amount: i64,
}

impl Damage {
    pub fn new(item_type: ItemType, amount: i64) -> Self {
        Self { item_type, amount }
    }

    /// The damages of one incident are all entertained, or the incident is
    /// refused whole: the MHPCO reads a damage report for admissibility before it
    /// asks which insured item answers, so an inadmissible report is refused on
    /// its own terms rather than as a coverage failure.
    fn check_all_reportable(damages: &[Self]) -> Result<(), String> {
        damages.iter().try_for_each(Self::check_reportable)
    }

    /// The MHPCO does not entertain a damage report for a negative amount.
    fn check_reportable(&self) -> Result<(), String> {
        if self.amount < 0 {
            return Err(format!(
                "a damage to a {} cannot be a negative amount of {} G",
                self.item_type.name(),
                self.amount
            ));
        }
        Ok(())
    }

    /// What the MHPCO reimburses for this one damaged item, as an exact
    /// fraction: the share of the damage amount the insured item's clauses
    /// allow, less the deductible that applies once per damage event.
    fn reimbursement(&self, insured: &Item) -> f64 {
        self.amount as f64 * insured.reimbursement_share() - DEDUCTIBLE_PER_DAMAGE
    }
}

/// How the MHPCO settles a reimbursed amount into the amount it pays out: the
/// reimbursed fraction is rounded in the MHPCO's own favour -- downwards, the
/// smaller amount -- which is the opposite direction from a premium.
fn settled_payout(reimbursed: f64) -> u64 {
    reimbursed.floor() as u64
}

/// What the MHPCO pays out on one claim.
#[derive(Debug, PartialEq, Eq)]
pub struct Settlement {
    pub payout: u64,
    pub remaining_cap: u64,
}

/// A policy the MHPCO has written over a customer's items.
pub struct Policy {
    items: Vec<Item>,
    remaining_cap: u64,
}

/// The MHPCO's record of which insured items have already answered for a damage
/// within one incident. The office holds each insured item to at most one damage
/// per incident, so an incident reporting more damaged items of a type than the
/// policy insures finds no further item to answer and is rejected whole.
///
/// The ledger is the MHPCO's coverage decision, kept apart from how a damage is
/// reimbursed once covered: which insured item answers may come to depend on the
/// item's own properties, while what it reimburses is already the clauses on
/// `Item` and `Damage`.
struct CoverageLedger {
    answered: Vec<usize>,
}

impl CoverageLedger {
    /// A fresh ledger: no insured item has answered yet in this incident.
    fn for_incident() -> Self {
        Self {
            answered: Vec::new(),
        }
    }

    /// The insured item that answers for this damage, recorded as answered so it
    /// cannot answer again in this incident. Any insured item of the reported type
    /// that has not yet answered will do: two items of a type carry the same
    /// reimbursement clauses, so which one is chosen cannot move the payout.
    fn assign(&mut self, policy: &Policy, damage: &Damage) -> Result<usize, String> {
        let index = policy
            .items
            .iter()
            .enumerate()
            .position(|(index, item)| {
                item.item_type == damage.item_type && !self.answered.contains(&index)
            })
            .ok_or_else(|| {
                format!(
                    "the policy covers no unclaimed item of type '{}'",
                    damage.item_type.name()
                )
            })?;
        self.answered.push(index);
        Ok(index)
    }
}

impl Policy {
    pub fn new(items: &[Item]) -> Self {
        Self {
            remaining_cap: Self::payout_cap(items),
            items: items.to_vec(),
        }
    }

    /// The policy's insurance sum: the sum of the insured items' insurance
    /// values. Every insured item counts its own value, so two items of one type
    /// count twice, and a block of alike components counts each component -- the
    /// block discount is a premium offer and leaves the insurance sum untouched.
    fn insurance_sum(items: &[Item]) -> u64 {
        items
            .iter()
            .map(|item| item.item_type.insurance_value())
            .sum()
    }

    /// What the MHPCO will pay out over the whole life of this policy. The cap is
    /// read off the insurance sum alone: premium modifiers rate the contract and
    /// do not raise the cap.
    fn payout_cap(items: &[Item]) -> u64 {
        CAP_MULTIPLE * Self::insurance_sum(items)
    }

    /// The insured items that answer for the damages of one incident, in the
    /// order the damages were reported. Assigning coverage for the whole
    /// incident at once is what lets the MHPCO hold each insured item to at most
    /// one damage, and so notice an incident that over-reports a type.
    fn covering_items(&self, damages: &[Damage]) -> Result<Vec<&Item>, String> {
        let mut ledger = CoverageLedger::for_incident();
        damages
            .iter()
            .map(|damage| ledger.assign(self, damage).map(|index| &self.items[index]))
            .collect()
    }

    /// What the MHPCO reimburses for a whole incident, as an exact fraction: the
    /// office entertains the report, finds the insured item that answers for each
    /// damage, and reimburses each under that item's clauses. This is the
    /// incident-level amount the MHPCO recognises, before it is settled into the
    /// amount paid out.
    fn reimbursed_total(&self, damages: &[Damage]) -> Result<f64, String> {
        Damage::check_all_reportable(damages)?;
        let covering = self.covering_items(damages)?;
        Ok(damages
            .iter()
            .zip(covering)
            .map(|(damage, insured)| damage.reimbursement(insured))
            .sum())
    }

    /// The MHPCO's cap clause, applied to one settled amount: the cap limits what
    /// the policy pays out over its whole life, so an amount the MHPCO would
    /// otherwise pay is reduced to whatever cap is left, and what it does pay
    /// draws the cap down. The clause reads the already-settled whole-G amount --
    /// the cap is stated in whole G and limits the payout, not the reimbursement
    /// behind it.
    fn pay_within_cap(&mut self, settled: u64) -> u64 {
        let payout = settled.min(self.remaining_cap);
        self.remaining_cap -= payout;
        payout
    }

    /// The MHPCO settles an incident against this policy: it reimburses the
    /// incident under the policy's clauses, settles that total into whole G, and
    /// pays it out so far as the policy's cap still allows.
    pub fn claim(&mut self, damages: &[Damage]) -> Result<Settlement, String> {
        let reimbursed = self.reimbursed_total(damages)?;
        let payout = self.pay_within_cap(settled_payout(reimbursed));
        Ok(Settlement {
            payout,
            remaining_cap: self.remaining_cap,
        })
    }
}

/// One operation the MHPCO performs in a scenario.
pub enum Step {
    Quote { items: Vec<Item> },
    Claim { policy: usize, damages: Vec<Damage> },
}

/// The MHPCO handles one customer's operations in the order they are brought.
pub struct Scenario {
    pub customer: Customer,
    pub steps: Vec<Step>,
}

/// What the MHPCO records for one handled step.
#[derive(Debug, PartialEq, Eq)]
pub enum StepResult {
    Quote { premium: u64 },
    Claim { payout: u64, remaining_cap: u64 },
}

/// The sequence of contracts the MHPCO has written for a customer so far: the
/// first quote is a first contract, every later one a follow-up.
struct ContractSequence {
    quotes_handled: usize,
}

impl ContractSequence {
    fn opened() -> Self {
        Self { quotes_handled: 0 }
    }

    fn next_contract(&mut self) -> Contract {
        let contract = if self.quotes_handled == 0 {
            Contract::First
        } else {
            Contract::FollowUp
        };
        self.quotes_handled += 1;
        contract
    }
}

/// The policies the MHPCO's quotes have opened, addressed by the step that
/// quoted them. Every handled step takes a place in the register, whether or not
/// it opened a policy, because a claim names the policy it settles against by
/// that step's number -- so each kind of step is recorded by the register method
/// that handles it, and the register keeps the numbering straight itself.
struct PolicyRegister {
    by_step: Vec<Option<Policy>>,
}

impl PolicyRegister {
    /// A fresh register: the MHPCO has handled no step of this scenario yet.
    fn none_yet() -> Self {
        Self { by_step: Vec::new() }
    }

    /// The MHPCO records the policy this quote opened against the step that
    /// quoted it.
    fn record_quote(&mut self, items: &[Item]) {
        self.by_step.push(Some(Policy::new(items)));
    }

    /// The policy a claim step names, or a refusal. A claim reaches backwards
    /// only: the office honours a reference to a policy one of its *earlier*
    /// quotes opened, so a step naming itself, a later step, or a step that
    /// quoted nothing names no policy it can settle against.
    ///
    /// Taking the claim's own place on the register first is what makes
    /// "earlier" the same question as "on the register": the claim opens no
    /// policy of its own, but it still occupies its number so that the steps
    /// after it keep theirs. That ordering is the register's own rule, so it is
    /// kept here rather than left to whoever handles the steps.
    fn policy_claimed_against(&mut self, claiming_step: usize) -> Result<&mut Policy, String> {
        self.by_step.push(None);
        self.by_step
            .get_mut(claiming_step)
            .and_then(Option::as_mut)
            .ok_or_else(|| format!("step {claiming_step} did not open a policy"))
    }
}

/// The MHPCO handles each step of a scenario in turn, keeping the policies its
/// quotes opened so that later claims can be settled against them.
pub fn run_scenario(scenario: &Scenario) -> Result<Vec<StepResult>, String> {
    let mut policies = PolicyRegister::none_yet();
    let mut contracts = ContractSequence::opened();
    let mut results = Vec::new();

    for step in &scenario.steps {
        results.push(match step {
            Step::Quote { items } => {
                let premium = quote(&scenario.customer, items, contracts.next_contract());
                policies.record_quote(items);
                StepResult::Quote { premium }
            }
            Step::Claim { policy, damages } => {
                let settlement = policies.policy_claimed_against(*policy)?.claim(damages)?;
                StepResult::Claim {
                    payout: settlement.payout,
                    remaining_cap: settlement.remaining_cap,
                }
            }
        });
    }

    Ok(results)
}

/// The MHPCO's documented wire shapes. The field names here are binding; the
/// domain vocabulary inside the office is kept separate from them.
mod wire {
    use super::{Customer, Damage, Item, ItemType, Scenario, Step, StepResult};
    use serde::{Deserialize, Serialize};

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct WireCustomer {
        #[serde(rename = "yearsWithMHPCO")]
        years_with_mhpco: u32,
    }

    #[derive(Deserialize)]
    struct WireItem {
        #[serde(rename = "type")]
        item_type: String,
        #[serde(default)]
        enchantment: u32,
        #[serde(default)]
        cursed: bool,
        #[serde(default)]
        material: String,
    }

    #[derive(Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct WireDamage {
        item_type: String,
        amount: i64,
    }

    #[derive(Deserialize)]
    struct WireIncident {
        damages: Vec<WireDamage>,
    }

    #[derive(Deserialize)]
    #[serde(tag = "op", rename_all = "lowercase")]
    enum WireStep {
        Quote {
            items: Vec<WireItem>,
        },
        Claim {
            policy: usize,
            incident: WireIncident,
        },
    }

    #[derive(Deserialize)]
    struct WireScenario {
        customer: WireCustomer,
        steps: Vec<WireStep>,
    }

    #[derive(Serialize)]
    #[serde(untagged)]
    enum WireResult {
        Quote {
            premium: u64,
        },
        Claim {
            payout: u64,
            #[serde(rename = "remainingCap")]
            remaining_cap: u64,
        },
    }

    #[derive(Serialize)]
    struct WireResults {
        results: Vec<WireResult>,
    }

    impl WireItem {
        fn into_item(self) -> Result<Item, String> {
            Ok(Item::new(ItemType::parse(&self.item_type)?)
                .with_enchantment(self.enchantment)
                .of_material(&self.material)
                .cursed(self.cursed))
        }
    }

    impl WireDamage {
        fn into_damage(self) -> Result<Damage, String> {
            Ok(Damage::new(ItemType::parse(&self.item_type)?, self.amount))
        }
    }

    impl WireStep {
        fn into_step(self) -> Result<Step, String> {
            match self {
                Self::Quote { items } => Ok(Step::Quote {
                    items: items
                        .into_iter()
                        .map(WireItem::into_item)
                        .collect::<Result<_, _>>()?,
                }),
                Self::Claim { policy, incident } => Ok(Step::Claim {
                    policy,
                    damages: incident
                        .damages
                        .into_iter()
                        .map(WireDamage::into_damage)
                        .collect::<Result<_, _>>()?,
                }),
            }
        }
    }

    /// Reads a scenario as the MHPCO's documented input shape.
    pub fn read_scenario(document: &str) -> Result<Scenario, String> {
        let read: WireScenario = serde_json::from_str(document)
            .map_err(|failure| format!("the scenario could not be read: {failure}"))?;
        Ok(Scenario {
            customer: Customer::new(read.customer.years_with_mhpco),
            steps: read
                .steps
                .into_iter()
                .map(WireStep::into_step)
                .collect::<Result<_, _>>()?,
        })
    }

    /// Writes handled steps as the MHPCO's documented output shape.
    pub fn write_results(results: Vec<StepResult>) -> Result<String, String> {
        let written = WireResults {
            results: results
                .into_iter()
                .map(|result| match result {
                    StepResult::Quote { premium } => WireResult::Quote { premium },
                    StepResult::Claim {
                        payout,
                        remaining_cap,
                    } => WireResult::Claim {
                        payout,
                        remaining_cap,
                    },
                })
                .collect(),
        };
        serde_json::to_string(&written)
            .map_err(|failure| format!("the results could not be written: {failure}"))
    }
}

/// The MHPCO reads a scenario from the documented JSON, handles it, and writes
/// the results back in the documented JSON.
pub fn run_scenario_json(document: &str) -> Result<String, String> {
    let scenario = wire::read_scenario(document)?;
    wire::write_results(run_scenario(&scenario)?)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn quote_first(customer: &Customer, items: &[Item]) -> u64 {
        quote(customer, items, Contract::First)
    }

    fn alike_components(count: usize, component_type: ItemType) -> Vec<Item> {
        (0..count).map(|_| Item::new(component_type)).collect()
    }

    #[test]
    fn quote_for_empty_item_list_is_only_the_processing_fee() {
        assert_eq!(quote_first(&Customer::new(0), &[]), 5);
    }

    #[test]
    fn quote_for_a_plain_sword_uses_the_sword_base_premium() {
        assert_eq!(quote_first(&Customer::new(0), &[Item::new(ItemType::Sword)]), 115);
    }

    #[test]
    fn quote_for_a_plain_amulet_uses_the_amulet_base_premium() {
        assert_eq!(quote_first(&Customer::new(0), &[Item::new(ItemType::Amulet)]), 71);
    }

    #[test]
    fn quote_for_a_plain_staff_uses_the_staff_base_premium() {
        assert_eq!(quote_first(&Customer::new(0), &[Item::new(ItemType::Staff)]), 93);
    }

    #[test]
    fn quote_for_a_plain_potion_uses_the_potion_base_premium() {
        assert_eq!(quote_first(&Customer::new(0), &[Item::new(ItemType::Potion)]), 49);
    }

    #[test]
    fn quote_for_a_single_rune_uses_the_component_base_premium() {
        assert_eq!(quote_first(&Customer::new(0), &[Item::new(ItemType::Rune)]), 33);
    }

    #[test]
    fn quote_for_a_single_moonstone_uses_the_component_base_premium() {
        assert_eq!(quote_first(&Customer::new(0), &[Item::new(ItemType::Moonstone)]), 33);
    }

    #[test]
    fn quote_with_an_unknown_item_type_is_rejected() {
        let rejection = ItemType::parse("broomstick");

        assert!(rejection.is_err());
        assert_eq!(ItemType::parse("sword"), Ok(ItemType::Sword));
    }

    #[test]
    fn two_alike_components_have_no_block_discount() {
        let two_runes = alike_components(2, ItemType::Rune);

        assert_eq!(policy_base_premium(&two_runes), 50.0);
    }

    #[test]
    fn three_alike_components_form_a_block_at_sixty() {
        let three_runes = alike_components(3, ItemType::Rune);

        assert_eq!(policy_base_premium(&three_runes), 60.0);
    }

    #[test]
    fn four_alike_components_get_no_block_discount() {
        let four_runes = alike_components(4, ItemType::Rune);

        assert_eq!(policy_base_premium(&four_runes), 100.0);
    }

    #[test]
    fn seven_alike_components_get_no_block_discount() {
        assert_eq!(policy_base_premium(&alike_components(7, ItemType::Rune)), 175.0);
    }

    #[test]
    fn components_of_different_types_do_not_form_a_block() {
        let mixed = [
            Item::new(ItemType::Rune),
            Item::new(ItemType::Rune),
            Item::new(ItemType::Moonstone),
        ];

        assert_eq!(policy_base_premium(&mixed), 75.0);
    }

    #[test]
    fn each_component_type_forms_its_own_block() {
        let mut two_blocks = alike_components(3, ItemType::Rune);
        two_blocks.extend(alike_components(3, ItemType::Moonstone));

        assert_eq!(policy_base_premium(&two_blocks), 120.0);
    }

    #[test]
    fn a_cursed_item_adds_a_fifty_percent_risk_surcharge() {
        let cursed_sword = Item::new(ItemType::Sword).cursed(true);

        assert_eq!(quote_first(&Customer::new(0), &[cursed_sword]), 165);
    }

    #[test]
    fn enchantment_of_exactly_five_adds_the_high_enchantment_surcharge() {
        let enchanted_sword = Item::new(ItemType::Sword).with_enchantment(5);

        assert_eq!(quote_first(&Customer::new(0), &[enchanted_sword]), 145);
    }

    #[test]
    fn enchantment_of_four_adds_no_high_enchantment_surcharge() {
        let sword = Item::new(ItemType::Sword).with_enchantment(4);

        assert_eq!(quote_first(&Customer::new(0), &[sword]), 115);
    }

    #[test]
    fn cursed_and_highly_enchanted_item_gets_both_surcharges() {
        let sword = Item::new(ItemType::Sword).with_enchantment(5).cursed(true);

        assert_eq!(quote_first(&Customer::new(0), &[sword]), 195);
    }

    #[test]
    fn exactly_two_years_with_mhpco_grants_the_loyalty_discount() {
        let long_standing = Customer::new(2);

        assert_eq!(quote_first(&long_standing, &[Item::new(ItemType::Sword)]), 95);
    }

    #[test]
    fn one_year_with_mhpco_grants_no_loyalty_discount() {
        assert_eq!(quote_first(&Customer::new(1), &[Item::new(ItemType::Sword)]), 115);
    }

    #[test]
    fn a_follow_up_contract_gets_the_fifteen_percent_discount() {
        let sword = [Item::new(ItemType::Sword)];

        assert_eq!(
            quote(&Customer::new(0), &sword, Contract::FollowUp),
            100
        );
        assert_eq!(quote(&Customer::new(0), &sword, Contract::First), 115);
    }

    #[test]
    fn the_first_insurance_surcharge_applies_to_every_quoted_item() {
        let brand_new_sword = [Item::new(ItemType::Sword)];

        assert_eq!(
            quote(&Customer::new(3), &brand_new_sword, Contract::FollowUp),
            80
        );
    }

    #[test]
    fn an_item_surcharge_applies_only_to_the_affected_items_base_premium() {
        let policy = [
            Item::new(ItemType::Sword).cursed(true),
            Item::new(ItemType::Amulet),
        ];

        assert_eq!(policy_base_premium(&policy), 160.0);
        // 210 G before further modifiers, then 16 G first insurance and the fee.
        assert_eq!(quote_first(&Customer::new(0), &policy), 231);
    }

    #[test]
    fn a_fractional_premium_is_rounded_up() {
        // 5 runes: 125 G base, +10% first insurance = 137.5 G, rounded up to 138 G.
        let five_runes = alike_components(5, ItemType::Rune);

        assert_eq!(policy_base_premium(&five_runes), 125.0);
        assert_eq!(quote_first(&Customer::new(0), &five_runes), 143);
    }

    #[test]
    fn integration_newcomer_with_a_cursed_sword_pays_165() {
        let newcomer = Customer::new(0);
        let cursed_steel_sword = [Item::new(ItemType::Sword)
            .with_enchantment(3)
            .cursed(true)];

        assert_eq!(quote(&newcomer, &cursed_steel_sword, Contract::First), 165);
    }

    #[test]
    fn integration_long_standing_customers_second_contract_pays_160() {
        let long_standing = Customer::new(3);
        let cursed_enchanted_sword = [Item::new(ItemType::Sword)
            .with_enchantment(7)
            .cursed(true)];

        assert_eq!(
            quote(&long_standing, &cursed_enchanted_sword, Contract::FollowUp),
            160
        );
    }

    #[test]
    fn standard_damage_is_reimbursed_in_full_minus_the_deductible() {
        let mut policy = Policy::new(&[Item::new(ItemType::Sword).with_enchantment(3)]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 500)]).unwrap();

        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn component_damage_is_reimbursed_in_full_minus_the_deductible() {
        let mut policy = Policy::new(&[Item::new(ItemType::Rune)]);

        let settlement = policy.claim(&[Damage::new(ItemType::Rune, 200)]).unwrap();

        assert_eq!(settlement.payout, 100);
    }

    #[test]
    fn damage_to_a_highly_enchanted_item_is_halved_before_the_deductible() {
        let mut policy = Policy::new(&[Item::new(ItemType::Sword).with_enchantment(9)]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 1000)]).unwrap();

        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn enchantment_of_exactly_eight_triggers_the_half_reimbursement() {
        let mut policy = Policy::new(&[Item::new(ItemType::Sword).with_enchantment(8)]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 1000)]).unwrap();

        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn dragon_material_damage_is_fully_reimbursed_minus_the_deductible() {
        let dragon_sword = Item::new(ItemType::Sword)
            .with_enchantment(5)
            .of_material("dragon");
        let mut policy = Policy::new(&[dragon_sword]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 800)]).unwrap();

        assert_eq!(settlement.payout, 700);
    }

    #[test]
    fn the_high_enchantment_clause_wins_over_dragon_material() {
        let dragon_sword = Item::new(ItemType::Sword)
            .with_enchantment(9)
            .of_material("dragon");
        let mut policy = Policy::new(&[dragon_sword]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 1000)]).unwrap();

        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn dragon_material_with_enchantment_exactly_eight_pays_400() {
        let dragon_sword = Item::new(ItemType::Sword)
            .with_enchantment(8)
            .of_material("dragon");
        let mut policy = Policy::new(&[dragon_sword]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 1000)]).unwrap();

        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn the_deductible_applies_once_per_damaged_item() {
        let mut policy = Policy::new(&[
            Item::new(ItemType::Sword),
            Item::new(ItemType::Amulet),
        ]);

        let settlement = policy
            .claim(&[
                Damage::new(ItemType::Sword, 500),
                Damage::new(ItemType::Amulet, 300),
            ])
            .unwrap();

        assert_eq!(settlement.payout, 600);
    }

    #[test]
    fn a_fractional_payout_is_rounded_down() {
        // Half of 901 G is 450.5 G; less the 100 G deductible that is 350.5 G.
        let mut policy = Policy::new(&[Item::new(ItemType::Sword).with_enchantment(9)]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 901)]).unwrap();

        assert_eq!(settlement.payout, 350);
    }

    #[test]
    fn the_cap_is_twice_the_sum_of_the_insured_items_values() {
        let mut policy = Policy::new(&[
            Item::new(ItemType::Sword),
            Item::new(ItemType::Amulet),
        ]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 300)]).unwrap();

        // Insurance sum 1000 + 600 = 1600 G, so the cap is 3200 G; 200 G paid out.
        assert_eq!(settlement.payout, 200);
        assert_eq!(settlement.remaining_cap, 3000);
    }

    #[test]
    fn premium_modifiers_do_not_change_the_cap() {
        let cursed_sword = Item::new(ItemType::Sword).with_enchantment(5).cursed(true);
        let mut policy = Policy::new(&[cursed_sword]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 200)]).unwrap();

        // Cap 2000 G from the unmodified 1000 G insurance value, not the premium.
        assert_eq!(settlement.payout, 100);
        assert_eq!(settlement.remaining_cap, 1900);
    }

    #[test]
    fn the_block_discount_does_not_change_the_insurance_sum() {
        let mut items = vec![Item::new(ItemType::Sword)];
        items.extend(alike_components(3, ItemType::Rune));
        let mut policy = Policy::new(&items);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 300)]).unwrap();

        // Insurance sum 1000 + 3x250 = 1750 G, so the cap is 3500 G.
        assert_eq!(settlement.remaining_cap, 3300);
        // The block discount applies to the premium only.
        assert_eq!(policy_base_premium(&items), 160.0);
    }

    #[test]
    fn successive_claims_exhaust_the_remaining_cap() {
        let mut policy = Policy::new(&[Item::new(ItemType::Sword)]);

        let first = policy.claim(&[Damage::new(ItemType::Sword, 1500)]).unwrap();
        assert_eq!(first.payout, 1400);
        assert_eq!(first.remaining_cap, 600);

        let second = policy.claim(&[Damage::new(ItemType::Sword, 1500)]).unwrap();
        assert_eq!(second.payout, 600);
        assert_eq!(second.remaining_cap, 0);
    }

    #[test]
    fn two_items_of_the_same_type_both_count_toward_the_insurance_sum() {
        let mut policy = Policy::new(&[
            Item::new(ItemType::Sword),
            Item::new(ItemType::Sword),
        ]);

        let settlement = policy.claim(&[Damage::new(ItemType::Sword, 300)]).unwrap();

        // Insurance sum 2x1000 = 2000 G, so the cap is 4000 G.
        assert_eq!(settlement.remaining_cap, 3800);
    }

    #[test]
    fn each_damage_entry_of_a_repeated_item_type_gets_its_own_deductible() {
        let mut policy = Policy::new(&[
            Item::new(ItemType::Sword),
            Item::new(ItemType::Sword),
        ]);

        let settlement = policy
            .claim(&[
                Damage::new(ItemType::Sword, 500),
                Damage::new(ItemType::Sword, 500),
            ])
            .unwrap();

        assert_eq!(settlement.payout, 800);
    }

    #[test]
    fn more_damage_entries_than_insured_items_of_that_type_is_rejected() {
        let mut policy = Policy::new(&[Item::new(ItemType::Sword)]);

        let rejection = policy.claim(&[
            Damage::new(ItemType::Sword, 500),
            Damage::new(ItemType::Sword, 500),
        ]);

        assert!(rejection.is_err());
    }

    #[test]
    fn a_damage_to_an_item_outside_the_policy_is_rejected() {
        let mut policy = Policy::new(&[Item::new(ItemType::Sword)]);

        let rejection = policy.claim(&[Damage::new(ItemType::Amulet, 300)]);

        assert!(rejection.is_err());
    }

    #[test]
    fn a_damage_with_an_unknown_item_type_is_rejected() {
        // A damage carries a typed item type, so an unknown one can only arrive
        // through the scenario's JSON, where the MHPCO refuses to read it.
        assert!(ItemType::parse("wyvern-tooth").is_err());
    }

    #[test]
    fn a_negative_damage_amount_is_rejected() {
        let mut policy = Policy::new(&[Item::new(ItemType::Sword)]);

        let rejection = policy.claim(&[Damage::new(ItemType::Sword, -200)]);

        assert!(rejection.is_err());
    }

    #[test]
    fn a_scenario_returns_one_result_per_step_in_order() {
        let scenario = Scenario {
            customer: Customer::new(0),
            steps: vec![
                Step::Quote {
                    items: vec![Item::new(ItemType::Sword)],
                },
                Step::Quote {
                    items: vec![Item::new(ItemType::Amulet)],
                },
            ],
        };

        let results = run_scenario(&scenario).unwrap();

        assert_eq!(results.len(), 2);
        assert_eq!(results[0], StepResult::Quote { premium: 115 });
    }

    #[test]
    fn the_schema_example_scenario_produces_a_quote_and_a_claim_result() {
        let scenario = Scenario {
            customer: Customer::new(5),
            steps: vec![
                Step::Quote {
                    items: vec![Item::new(ItemType::Amulet)
                        .of_material("silver")
                        .with_enchantment(2)],
                },
                Step::Claim {
                    policy: 0,
                    damages: vec![Damage::new(ItemType::Amulet, 200)],
                },
            ],
        };

        let results = run_scenario(&scenario).unwrap();

        // 60 G base + 6 G first insurance - 12 G loyalty = 54 G, + 5 G fee.
        assert_eq!(results[0], StepResult::Quote { premium: 59 });
        // 200 G less the deductible; cap 2x600 = 1200 G.
        assert_eq!(
            results[1],
            StepResult::Claim {
                payout: 100,
                remaining_cap: 1100,
            }
        );
    }

    #[test]
    fn the_scenario_is_driven_by_the_documented_json_contract() {
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

        let stdout = run_scenario_json(stdin).unwrap();

        assert_eq!(
            stdout,
            r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
        );
    }

    #[test]
    fn the_json_contract_rejects_an_unknown_item_type() {
        let stdin = r#"{"customer": {"yearsWithMHPCO": 0},
            "steps": [{"op": "quote", "items": [{"type": "broomstick"}]}]}"#;

        assert!(run_scenario_json(stdin).is_err());
    }
}
