mod wire;

pub use wire::settle_scenario_document;

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum ItemType {
    Sword,
    Amulet,
    Staff,
    Potion,
    Rune,
    Moonstone,
}

/// What MHPCO records an item as being made of. The office keeps a material
/// on every item it insures, but its policy wording singles out only one:
/// the rest it records as an ordinary material and draws no distinction
/// between them.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum Material {
    Dragon,
    Ordinary,
}

impl Material {
    /// The material MHPCO recognises under this name. A name the office draws
    /// no distinction by -- steel, silver -- is recorded as ordinary.
    pub fn named(name: &str) -> Self {
        match name {
            "dragon" => Self::Dragon,
            _ => Self::Ordinary,
        }
    }
}

#[derive(Clone, Copy, Debug)]
pub struct Item {
    pub item_type: ItemType,
    pub material: Material,
    pub cursed: bool,
    pub enchantment: u32,
}

impl Item {
    pub fn new(item_type: ItemType) -> Self {
        Self {
            item_type,
            material: Material::Ordinary,
            cursed: false,
            enchantment: 0,
        }
    }

    /// The material MHPCO records the item as being made of.
    pub fn made_of(self, material: &str) -> Self {
        Self {
            material: Material::named(material),
            ..self
        }
    }

    pub fn with_enchantment(self, enchantment: u32) -> Self {
        Self {
            enchantment,
            ..self
        }
    }

    pub fn cursed(self) -> Self {
        Self {
            cursed: true,
            ..self
        }
    }
}

/// The single customer a scenario's policies belong to, together with the
/// standing they have earned with MHPCO: how long they have been in business
/// with the office, and how many contracts it has already written for them.
/// Every policy-wide modifier is measured against this standing.
#[derive(Clone, Copy, Debug)]
pub struct Customer {
    pub years_with_mhpco: u32,
    pub contracts_written: u32,
}

impl Customer {
    pub fn with_years(years_with_mhpco: u32) -> Self {
        Self {
            years_with_mhpco,
            contracts_written: 0,
        }
    }

    /// MHPCO counts a contract as a follow-up once it has already written the
    /// customer at least one: every contract after their first, not merely the
    /// second.
    fn on_a_follow_up_contract(&self) -> bool {
        self.contracts_written > 0
    }

    /// The office enters the contract it has just written into the customer's
    /// standing, so the next quote is measured against the fuller history.
    fn record_contract_written(&mut self) {
        self.contracts_written += 1;
    }
}

/// Every component is insured for the same sum, whatever its type.
const COMPONENT_INSURANCE_VALUE: u64 = 250;

/// Every component is insured at the same uniform rate, whatever its type.
const COMPONENT_BASE_PREMIUM: u64 = 25;

/// What the MHPCO price list records against one item type: the name the
/// office trades under for it, and the base premium it charges. The office
/// keeps the two together because an item type exists on the list precisely
/// by being priced on it -- a type it can name but not price, or price but
/// not name, is not something it insures.
struct PriceListEntry {
    name: &'static str,
    insurance_value: u64,
    base_premium: u64,
}

impl ItemType {
    /// This type's entry on the MHPCO price list. The one place the office
    /// enumerates what it insures: every item type it knows is named and
    /// priced here, and nowhere else.
    const fn price_list_entry(self) -> PriceListEntry {
        let (name, insurance_value, base_premium) = match self {
            Self::Sword => ("sword", 1000, 100),
            Self::Amulet => ("amulet", 600, 60),
            Self::Staff => ("staff", 800, 80),
            Self::Potion => ("potion", 400, 40),
            Self::Rune => ("rune", COMPONENT_INSURANCE_VALUE, COMPONENT_BASE_PREMIUM),
            Self::Moonstone => ("moonstone", COMPONENT_INSURANCE_VALUE, COMPONENT_BASE_PREMIUM),
        };
        PriceListEntry {
            name,
            insurance_value,
            base_premium,
        }
    }

    /// Every item type the price list carries, in the order the list states
    /// them.
    const PRICE_LIST: [Self; 6] = [
        Self::Sword,
        Self::Amulet,
        Self::Staff,
        Self::Potion,
        Self::Rune,
        Self::Moonstone,
    ];

    /// Resolves the item type MHPCO knows by this name on its price list.
    pub fn named(name: &str) -> Result<Self, String> {
        Self::PRICE_LIST
            .into_iter()
            .find(|item_type| item_type.price_list_entry().name == name)
            .ok_or_else(|| format!("MHPCO does not insure items of type {name}"))
    }
}

fn base_premium(item_type: ItemType) -> u64 {
    item_type.price_list_entry().base_premium
}

/// What MHPCO insures one item of this type for, as its price list records.
/// This is the unmodified figure: no premium modifier and no block discount
/// bears on what an item is insured for.
fn insurance_value(item_type: ItemType) -> u64 {
    item_type.price_list_entry().insurance_value
}

/// A building block is formed by exactly this many alike components:
/// neither fewer nor more qualify for the special block premium.
const BLOCK_COMPONENT_COUNT: usize = 3;

/// The special base premium MHPCO offers for one building block.
const BLOCK_BASE_PREMIUM: u64 = 60;

fn alike_group_base_premium(item_type: ItemType, count: usize) -> u64 {
    if count == BLOCK_COMPONENT_COUNT {
        return BLOCK_BASE_PREMIUM;
    }
    count as u64 * base_premium(item_type)
}

/// Gathers the policy's items into groups of alike items, counting each group.
/// MHPCO counts two items as alike when they are of exactly the same item type
/// -- a rune and a moonstone are not alike, so they form no building block
/// together, and no other attribute of an item bears on the grouping.
fn alike_groups(items: &[Item]) -> Vec<(ItemType, usize)> {
    let mut groups: Vec<(ItemType, usize)> = Vec::new();
    for item in items {
        match groups.iter_mut().find(|(alike, _)| *alike == item.item_type) {
            Some((_, count)) => *count += 1,
            None => groups.push((item.item_type, 1)),
        }
    }
    groups
}

fn policy_base_premium(items: &[Item]) -> u64 {
    alike_groups(items)
        .into_iter()
        .map(|(item_type, count)| alike_group_base_premium(item_type, count))
        .sum()
}

/// A cursed item carries this share of its base premium as a risk surcharge.
const CURSE_SURCHARGE_RATE: u64 = 50;

/// Every MHPCO modifier is quoted as a rate out of this whole.
const PERCENT: u64 = 100;

/// An amount of money as MHPCO carries it through a calculation: an exact
/// fraction of a G, counted in hundredths. The office keeps every intermediate
/// amount in this form and rounds only once, when the final premium or payout
/// leaves the calculation -- and it rounds in its own favor, so a premium goes
/// up to the next whole G.
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug, Default)]
struct Hundredths(u64);

impl Hundredths {
    const PER_G: u64 = 100;

    const ZERO: Self = Self(0);

    fn from_whole_g(whole_g: u64) -> Self {
        Self(whole_g * Self::PER_G)
    }

    /// A rate of this amount, quoted as a percentage of it. MHPCO states
    /// every modifier this way, and the share stays exact in hundredths:
    /// a rate that does not divide the amount evenly is carried as a
    /// fraction rather than rounded here.
    fn percentage(self, rate: u64) -> Self {
        Self(self.0 * rate / PERCENT)
    }

    /// Rounds up to whole G, as MHPCO does with a premium.
    fn rounded_up_to_whole_g(self) -> u64 {
        self.0.div_ceil(Self::PER_G)
    }

    /// Rounds down to whole G, as MHPCO does with a payout.
    fn rounded_down_to_whole_g(self) -> u64 {
        self.0 / Self::PER_G
    }

    fn saturating_sub(self, other: Self) -> Self {
        Self(self.0.saturating_sub(other.0))
    }
}

impl std::ops::Add for Hundredths {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        Self(self.0 + other.0)
    }
}

impl std::iter::Sum for Hundredths {
    fn sum<I: Iterator<Item = Self>>(amounts: I) -> Self {
        amounts.fold(Self::ZERO, |running, amount| running + amount)
    }
}

/// A net change MHPCO applies to an amount. Surcharges raise it and discounts
/// lower it, and because the discounts can outweigh the surcharges the net may
/// fall either way -- so it is kept signed until it meets the amount it adjusts.
#[derive(Clone, Copy, Debug)]
struct Adjustment(i64);

impl Adjustment {
    fn raising(surcharge: Hundredths) -> Self {
        Self(surcharge.0 as i64)
    }

    fn lowered_by(self, discount: Hundredths) -> Self {
        Self(self.0 - discount.0 as i64)
    }
}

impl std::ops::Add<Adjustment> for Hundredths {
    type Output = Self;

    fn add(self, adjustment: Adjustment) -> Self {
        Self(self.0.saturating_add_signed(adjustment.0))
    }
}

/// A risk surcharge is always levied as a percentage of the affected item's
/// own base premium -- never of the policy total.
fn risk_surcharge(item: &Item, rate: u64) -> Hundredths {
    Hundredths::from_whole_g(base_premium(item.item_type)).percentage(rate)
}

fn curse_surcharge(item: &Item) -> Hundredths {
    if item.cursed {
        return risk_surcharge(item, CURSE_SURCHARGE_RATE);
    }
    Hundredths::ZERO
}

/// From this enchantment level on, an item counts as highly enchanted.
const HIGH_ENCHANTMENT_LEVEL: u32 = 5;

/// A highly enchanted item carries this share of its base premium as a
/// risk surcharge.
const HIGH_ENCHANTMENT_SURCHARGE_RATE: u64 = 30;

fn high_enchantment_surcharge(item: &Item) -> Hundredths {
    if item.enchantment >= HIGH_ENCHANTMENT_LEVEL {
        return risk_surcharge(item, HIGH_ENCHANTMENT_SURCHARGE_RATE);
    }
    Hundredths::ZERO
}

/// The hazards MHPCO levies on a single item. An item that is both cursed and
/// highly enchanted carries both surcharges; they stack rather than compete.
fn item_risk_surcharge(item: &Item) -> Hundredths {
    curse_surcharge(item) + high_enchantment_surcharge(item)
}

fn item_risk_surcharges(items: &[Item]) -> Hundredths {
    items.iter().map(item_risk_surcharge).sum()
}

/// From this many years of business on, a customer counts as long-standing.
const LOYALTY_YEARS: u32 = 2;

/// A long-standing customer receives this share of the policy base premium
/// as a discount.
const LOYALTY_DISCOUNT_RATE: u64 = 20;

fn loyalty_discount(customer: &Customer, policy_base_premium: Hundredths) -> Hundredths {
    if customer.years_with_mhpco >= LOYALTY_YEARS {
        return policy_base_premium.percentage(LOYALTY_DISCOUNT_RATE);
    }
    Hundredths::ZERO
}

/// Every quote is a first insurance of the items it covers, so MHPCO levies
/// this share of the policy base premium as an initial assessment surcharge.
const INITIAL_ASSESSMENT_RATE: u64 = 10;

fn initial_assessment_surcharge(policy_base_premium: Hundredths) -> Hundredths {
    policy_base_premium.percentage(INITIAL_ASSESSMENT_RATE)
}

/// Each contract after the customer's first earns this share of the policy
/// base premium as a discount.
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE: u64 = 15;

fn follow_up_contract_discount(customer: &Customer, policy_base_premium: Hundredths) -> Hundredths {
    if customer.on_a_follow_up_contract() {
        return policy_base_premium.percentage(FOLLOW_UP_CONTRACT_DISCOUNT_RATE);
    }
    Hundredths::ZERO
}

/// The modifiers MHPCO levies on the policy as a whole rather than on any one
/// item: they are measured against the policy base premium rather than any
/// item's. The discounts may outweigh the surcharge, so the catalogue nets out
/// to a single adjustment that can fall either way.
fn policy_wide_modifiers(customer: &Customer, policy_base_premium: Hundredths) -> Adjustment {
    Adjustment::raising(initial_assessment_surcharge(policy_base_premium))
        .lowered_by(loyalty_discount(customer, policy_base_premium))
        .lowered_by(follow_up_contract_discount(customer, policy_base_premium))
}

const PROCESSING_FEE: u64 = 5;

/// MHPCO keeps this much of every damage event to itself.
const DEDUCTIBLE_G: u64 = 100;

/// A damage report matched to the insured item it refers to. MHPCO settles a
/// damage only against an item its policy actually covers, so the office
/// establishes the cover for every damage in the incident before it reimburses
/// any of them.
#[derive(Clone, Copy, Debug)]
struct CoveredDamage {
    item: Item,
    amount: u64,
}

impl CoveredDamage {
    /// What MHPCO reimburses for this covered damage, before the policy cap.
    /// Two decisions in the order the policy wording puts them: the clause
    /// governing the damaged item first says what share of the damage is
    /// covered, and the deductible MHPCO keeps of every damage event is then
    /// taken off what that leaves.
    fn reimbursement(self) -> Hundredths {
        let covered = ReimbursementClause::governing(&self.item)
            .covers(Hundredths::from_whole_g(self.amount));
        covered.saturating_sub(Hundredths::from_whole_g(DEDUCTIBLE_G))
    }
}

/// The cover a policy still has to offer as MHPCO reads an incident: the
/// insured items not yet spoken for by an earlier damage report. The office
/// answers each report out of this standing cover and strikes the item it
/// used off, so no one insured item answers two reports.
struct UnclaimedCover(Vec<Item>);

impl UnclaimedCover {
    /// All the cover a policy offers, before any report in the incident has
    /// drawn on it.
    fn over(insured: &[Item]) -> Self {
        Self(insured.to_vec())
    }

    /// Draws the insured item this damage report refers to out of the cover
    /// not yet spoken for. MHPCO answers a report with an insured item of the
    /// type the report names; where the cover holds no such item left, the
    /// report is covered by nothing.
    fn answering(&mut self, damage: &Damage) -> Option<CoveredDamage> {
        let position = self
            .0
            .iter()
            .position(|item| item.item_type == damage.item_type)?;
        Some(CoveredDamage {
            item: self.0.remove(position),
            amount: damage.amount,
        })
    }
}

/// Reads the whole incident against the policy's cover, establishing the
/// cover for every damage it reports. MHPCO settles an incident only when it
/// covers every damage in it, so a single uncovered report refuses the lot.
fn covered_damages(insured: &[Item], damages: &[Damage]) -> Option<Vec<CoveredDamage>> {
    let mut unclaimed = UnclaimedCover::over(insured);
    damages
        .iter()
        .map(|damage| unclaimed.answering(damage))
        .collect()
}

/// The clause of the MHPCO policy wording a damaged item falls under. Which
/// clause governs an item is a question about the item alone, settled before
/// any amount of money is named; what the clause then reimburses is stated
/// against the clause, not against the item.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum ReimbursementClause {
    /// MHPCO reimburses only half the damage to a highly enchanted item.
    /// Stated first because it outranks the dragon-material clause: an item
    /// that falls under both is settled at the halved share.
    HighEnchantment,
    /// MHPCO reimburses damage to an item made of dragon material in full.
    DragonMaterial,
    /// Absent any special clause, MHPCO reimburses the damage in full.
    Standard,
}

impl ReimbursementClause {
    /// From this enchantment level on, an item falls under the high
    /// enchantment clause.
    const HIGH_ENCHANTMENT_LEVEL: u32 = 8;

    /// The share of the damage the high enchantment clause reimburses.
    const HALVED_SHARE: u64 = 50;

    /// The share of the damage a clause reimburses when it reimburses in full.
    const FULL_SHARE: u64 = PERCENT;

    /// The clause this damaged item falls under. Where an item answers to more
    /// than one special clause, the first one stated here governs it alone.
    fn governing(item: &Item) -> Self {
        if item.enchantment >= Self::HIGH_ENCHANTMENT_LEVEL {
            return Self::HighEnchantment;
        }
        if item.material == Material::Dragon {
            return Self::DragonMaterial;
        }
        Self::Standard
    }

    /// What this clause covers of a damage it governs, before the deductible
    /// MHPCO withholds of every damage event is taken off. Each clause is
    /// stated as the share of the damage it reimburses.
    fn covers(self, damage: Hundredths) -> Hundredths {
        let reimbursed_share = match self {
            Self::HighEnchantment => Self::HALVED_SHARE,
            Self::DragonMaterial | Self::Standard => Self::FULL_SHARE,
        };
        damage.percentage(reimbursed_share)
    }
}

/// What a policy insures its items for, all told.
fn insurance_sum(insured: &[Item]) -> u64 {
    insured
        .iter()
        .map(|item| insurance_value(item.item_type))
        .sum()
}

/// MHPCO pays out at most this multiple of a policy's insurance sum.
const PAYOUT_CAP_MULTIPLE: u64 = 2;

/// What a policy may still pay out. MHPCO opens it at twice the insurance
/// sum and never settles a claim for more than it holds, cutting a larger
/// reimbursement back to what is left.
#[derive(Clone, Copy, Debug)]
struct PolicyCap(u64);

impl PolicyCap {
    /// The cap MHPCO opens on a freshly written policy.
    fn opened_on(insured: &[Item]) -> Self {
        Self(insurance_sum(insured) * PAYOUT_CAP_MULTIPLE)
    }

    /// Settles a desired reimbursement against the cap: the office pays what
    /// the cap allows, draws that down from the cap, and reports the cap left
    /// standing afterwards.
    fn settle(&mut self, desired_payout: u64) -> Settlement {
        let payout = desired_payout.min(self.0);
        self.0 -= payout;
        Settlement {
            payout,
            remaining_cap: self.0,
        }
    }
}

/// What MHPCO owes for a whole incident, before the policy cap bears on it:
/// every covered damage the incident reports, reimbursed under the clause its
/// item falls under and less the deductible MHPCO keeps of each, added up.
fn incident_reimbursement(covered: &[CoveredDamage]) -> u64 {
    let reimbursement: Hundredths = covered
        .iter()
        .map(|damage| damage.reimbursement())
        .sum();
    reimbursement.rounded_down_to_whole_g()
}

pub fn quote(customer: &Customer, items: &[Item]) -> u64 {
    let policy_base_premium = Hundredths::from_whole_g(policy_base_premium(items));
    let premium = policy_base_premium
        + item_risk_surcharges(items)
        + policy_wide_modifiers(customer, policy_base_premium)
        + Hundredths::from_whole_g(PROCESSING_FEE);
    premium.rounded_up_to_whole_g()
}

/// One damaged item and what the damage amounts to.
#[derive(Clone, Copy, Debug)]
pub struct Damage {
    pub item_type: ItemType,
    pub amount: u64,
}

impl Damage {
    /// Reads a damage as it is reported to MHPCO. The office records damage
    /// as something an item suffered, so an amount below nothing names no
    /// damage it can settle and the report is refused where it is read.
    pub fn reported(item_type: ItemType, reported_amount: i64) -> Result<Self, String> {
        u64::try_from(reported_amount)
            .map(|amount| Self::to(item_type, amount))
            .map_err(|_| format!("MHPCO records no damage of {reported_amount} G"))
    }

    pub fn to(item_type: ItemType, amount: u64) -> Self {
        Self { item_type, amount }
    }
}

/// What MHPCO settles on a claim.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Settlement {
    pub payout: u64,
    pub remaining_cap: u64,
}

/// Identifies a policy the office has written.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PolicyRef(usize);

/// A policy MHPCO has written: the items it covers, and the cap it may pay
/// out over its lifetime. The office settles every claim against these two
/// together, so it records them together rather than deriving the cap afresh
/// each time a claim comes in.
struct Policy {
    insured: Vec<Item>,
    cap: PolicyCap,
}

impl Policy {
    /// The policy MHPCO writes over these items: it covers them, and its cap
    /// is opened on what they are insured for.
    fn written_over(items: &[Item]) -> Self {
        Self {
            insured: items.to_vec(),
            cap: PolicyCap::opened_on(items),
        }
    }

    /// Settles an incident against this policy. The policy establishes which
    /// of the items it covers each damage refers to, reimburses the incident
    /// under the clauses those items fall under, and pays that out of the cap
    /// it has left -- drawing the payout down, so a later claim meets a
    /// smaller cap.
    fn settle_incident(&mut self, damages: &[Damage]) -> Option<Settlement> {
        let covered = covered_damages(&self.insured, damages)?;
        Some(self.cap.settle(incident_reimbursement(&covered)))
    }
}

/// The MHPCO office serving one customer through a scenario. It keeps the
/// customer's standing current as it works, so each operation sees the
/// history the office has accumulated for them so far.
pub struct ClaimOffice {
    customer: Customer,
    register: Vec<Policy>,
}

impl ClaimOffice {
    pub fn serving(customer: Customer) -> Self {
        Self {
            customer,
            register: Vec::new(),
        }
    }

    /// Writes a policy over the given items, reporting the premium quoted and
    /// a reference to the policy a later claim can be made against.
    pub fn quote_policy(&mut self, items: &[Item]) -> (u64, PolicyRef) {
        let premium = self.quote(items);
        (premium, self.enter_policy_in_the_register(items))
    }

    /// The office enters the policy it has just written into its register, so
    /// a later claim can be settled against the items it covers.
    fn enter_policy_in_the_register(&mut self, items: &[Item]) -> PolicyRef {
        self.register.push(Policy::written_over(items));
        PolicyRef(self.register.len() - 1)
    }

    pub fn claim(&mut self, policy: PolicyRef, damages: &[Damage]) -> Option<Settlement> {
        self.register[policy.0].settle_incident(damages)
    }

    pub fn quote(&mut self, items: &[Item]) -> u64 {
        let premium = quote(&self.customer, items);
        self.customer.record_contract_written();
        premium
    }
}

/// One operation the office is asked to perform in a scenario.
#[derive(Clone, Debug)]
pub enum Step {
    Quote { items: Vec<Item> },
    Claim { policy: usize, damages: Vec<Damage> },
}

/// What the office reports for one step.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum StepResult {
    Quote { premium: u64 },
    Claim { payout: u64, remaining_cap: u64 },
}

/// A customer and the operations the office performs for them, in order.
#[derive(Clone, Debug)]
pub struct Scenario {
    pub customer: Customer,
    pub steps: Vec<Step>,
}

/// How a scenario's claim steps address the policies its quote steps wrote.
/// A claim names its policy by a number, and this directory is the one place
/// that says which written policy that number stands for.
#[derive(Default)]
/// The policies a scenario has had written, each under the number of the
/// step that wrote it, which is how a later claim step addresses it.
struct PolicyDirectory(Vec<(usize, PolicyRef)>);

impl PolicyDirectory {
    /// Records the policy the quote step at this number has just had written.
    fn record(&mut self, step_number: usize, policy: PolicyRef) {
        self.0.push((step_number, policy));
    }

    /// The policy a claim step addresses by this number, where the scenario
    /// has a policy under it.
    fn policy_addressed_by(&self, number: usize) -> Result<PolicyRef, String> {
        self.0
            .iter()
            .find(|(step_number, _)| *step_number == number)
            .map(|(_, policy)| *policy)
            .ok_or_else(|| format!("MHPCO holds no policy numbered {number}"))
    }
}

/// Performs a scenario's steps in order, reporting one result for each.
pub fn run(scenario: &Scenario) -> Result<Vec<StepResult>, String> {
    let mut office = ClaimOffice::serving(scenario.customer);
    let mut directory = PolicyDirectory::default();
    let mut results = Vec::new();
    for (step_number, step) in scenario.steps.iter().enumerate() {
        results.push(perform(step_number, step, &mut office, &mut directory)?);
    }
    Ok(results)
}

/// Has the office perform one step of a scenario and reports what it answers.
fn perform(
    step_number: usize,
    step: &Step,
    office: &mut ClaimOffice,
    directory: &mut PolicyDirectory,
) -> Result<StepResult, String> {
    match step {
        Step::Quote { items } => {
            let (premium, policy) = office.quote_policy(items);
            directory.record(step_number, policy);
            Ok(StepResult::Quote { premium })
        }
        Step::Claim { policy, damages } => {
            let settlement = office
                .claim(directory.policy_addressed_by(*policy)?, damages)
                .ok_or_else(|| "MHPCO refuses this claim".to_string())?;
            Ok(StepResult::Claim {
                payout: settlement.payout,
                remaining_cap: settlement.remaining_cap,
            })
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Puts one incident to a freshly opened MHPCO office over the given
    /// items and reports what it settles. The office is new to the customer
    /// in every claim example, so what each example actually states is the
    /// policy's items, the damages reported against them, and the settlement
    /// MHPCO owes -- not the standing up of the office in between.
    fn settlement_over(insured: &[Item], damages: &[Damage]) -> Settlement {
        let mut office = ClaimOffice::serving(Customer::with_years(0));
        let (_, policy) = office.quote_policy(insured);
        office.claim(policy, damages).expect("MHPCO covers this claim")
    }

    // --- Simplest: empty policy ---

    #[test]
    fn quotes_empty_item_list_as_processing_fee_only() {
        assert_eq!(quote(&Customer::with_years(0), &[]), 5);
    }

    // --- Base premiums per main item type (parallel catalogue: one test per entry) ---

    #[test]
    fn quotes_single_sword_at_its_base_premium() {
        assert_eq!(quote(&Customer::with_years(0), &[Item::new(ItemType::Sword)]), 115);
    }

    #[test]
    fn quotes_single_amulet_at_its_base_premium() {
        assert_eq!(quote(&Customer::with_years(0), &[Item::new(ItemType::Amulet)]), 71);
    }

    #[test]
    fn quotes_single_staff_at_its_base_premium() {
        assert_eq!(quote(&Customer::with_years(0), &[Item::new(ItemType::Staff)]), 93);
    }

    #[test]
    fn quotes_single_potion_at_its_base_premium() {
        assert_eq!(quote(&Customer::with_years(0), &[Item::new(ItemType::Potion)]), 49);
    }

    // --- Component base premiums (rune and moonstone are separate catalogue entries) ---

    #[test]
    fn quotes_single_rune_at_component_base_premium() {
        assert_eq!(quote(&Customer::with_years(0), &[Item::new(ItemType::Rune)]), 33);
    }

    #[test]
    fn quotes_single_moonstone_at_component_base_premium() {
        assert_eq!(quote(&Customer::with_years(0), &[Item::new(ItemType::Moonstone)]), 33);
    }

    // --- Building block of 3 alike components ---

    #[test]
    fn quotes_two_runes_without_block_discount() {
        let runes = [Item::new(ItemType::Rune); 2];
        assert_eq!(quote(&Customer::with_years(0), &runes), 60);
    }

    #[test]
    fn quotes_three_runes_as_one_block() {
        let runes = [Item::new(ItemType::Rune); 3];
        assert_eq!(quote(&Customer::with_years(0), &runes), 71);
    }

    #[test]
    fn quotes_four_runes_without_block_discount() {
        let runes = [Item::new(ItemType::Rune); 4];
        assert_eq!(quote(&Customer::with_years(0), &runes), 115);
    }

    #[test]
    fn quotes_seven_runes_without_block_discount() {
        let runes = [Item::new(ItemType::Rune); 7];
        assert_eq!(quote(&Customer::with_years(0), &runes), 198);
    }

    #[test]
    fn does_not_form_a_block_from_components_of_different_types() {
        let components = [
            Item::new(ItemType::Rune),
            Item::new(ItemType::Rune),
            Item::new(ItemType::Moonstone),
        ];
        assert_eq!(quote(&Customer::with_years(0), &components), 88);
    }

    #[test]
    fn forms_a_separate_block_per_component_type() {
        let mut components = vec![Item::new(ItemType::Rune); 3];
        components.extend([Item::new(ItemType::Moonstone); 3]);
        assert_eq!(quote(&Customer::with_years(0), &components), 137);
    }

    // --- Item-specific premium modifiers ---

    #[test]
    fn adds_fifty_percent_curse_surcharge_to_the_cursed_item() {
        let cursed_sword = Item::new(ItemType::Sword).cursed();
        assert_eq!(quote(&Customer::with_years(0), &[cursed_sword]), 165);
    }

    #[test]
    fn adds_high_enchantment_surcharge_at_exactly_enchantment_five() {
        let sword = Item::new(ItemType::Sword).with_enchantment(5);
        assert_eq!(quote(&Customer::with_years(0), &[sword]), 145);
    }

    #[test]
    fn omits_high_enchantment_surcharge_below_enchantment_five() {
        let sword = Item::new(ItemType::Sword).with_enchantment(4);
        assert_eq!(quote(&Customer::with_years(0), &[sword]), 115);
    }

    #[test]
    fn stacks_curse_and_high_enchantment_surcharges_on_one_item() {
        let sword = Item::new(ItemType::Sword).cursed().with_enchantment(5);
        assert_eq!(quote(&Customer::with_years(0), &[sword]), 195);
    }

    #[test]
    fn applies_item_modifiers_only_to_the_affected_item_base_premium() {
        let policy = [
            Item::new(ItemType::Sword).cursed(),
            Item::new(ItemType::Amulet),
        ];
        assert_eq!(quote(&Customer::with_years(0), &policy), 231);
    }

    // --- Policy-wide premium modifiers ---

    #[test]
    fn grants_loyalty_discount_at_exactly_two_years() {
        let customer = Customer::with_years(2);
        assert_eq!(quote(&customer, &[Item::new(ItemType::Sword)]), 95);
    }

    #[test]
    fn withholds_loyalty_discount_below_two_years() {
        let customer = Customer::with_years(1);
        assert_eq!(quote(&customer, &[Item::new(ItemType::Sword)]), 115);
    }

    #[test]
    fn measures_initial_assessment_surcharge_against_the_policy_base_premium() {
        // sword 100 G + amulet 60 G = 160 G policy base premium;
        // the 10 % initial assessment adds 16 G, then the 5 G fee.
        let policy = [Item::new(ItemType::Sword), Item::new(ItemType::Amulet)];
        assert_eq!(quote(&Customer::with_years(0), &policy), 181);
    }

    #[test]
    fn grants_follow_up_contract_discount_from_the_second_contract_on() {
        let mut office = ClaimOffice::serving(Customer::with_years(0));
        assert_eq!(office.quote(&[Item::new(ItemType::Sword)]), 115);
        assert_eq!(office.quote(&[Item::new(ItemType::Sword)]), 100);
    }

    #[test]
    fn grants_follow_up_contract_discount_on_each_contract_after_the_first() {
        let mut office = ClaimOffice::serving(Customer::with_years(0));
        office.quote(&[Item::new(ItemType::Sword)]);
        office.quote(&[Item::new(ItemType::Sword)]);
        assert_eq!(office.quote(&[Item::new(ItemType::Sword)]), 100);
    }

    // --- Rounding ---

    #[test]
    fn rounds_a_fractional_premium_up() {
        // Base premium 175 G, +10 % initial assessment, +5 G fee = 197.5 G exactly.
        let policy = [
            Item::new(ItemType::Sword),
            Item::new(ItemType::Rune),
            Item::new(ItemType::Rune),
            Item::new(ItemType::Moonstone),
        ];
        assert_eq!(quote(&Customer::with_years(0), &policy), 198);
    }

    #[test]
    fn rounds_a_fractional_payout_down() {
        // Enchantment 8 halves 901 G to 450.5 G; the deductible leaves 350.5 G.
        let sword = Item::new(ItemType::Sword).with_enchantment(8);
        let settlement = settlement_over(&[sword], &[Damage::to(ItemType::Sword, 901)]);
        assert_eq!(settlement.payout, 350);
    }

    // --- Quote integration examples ---

    #[test]
    fn quotes_newcomer_with_a_cursed_sword_at_165() {
        let sword = Item::new(ItemType::Sword).cursed().with_enchantment(3);
        assert_eq!(quote(&Customer::with_years(0), &[sword]), 165);
    }

    #[test]
    fn quotes_long_standing_customers_second_contract_at_160() {
        let mut office = ClaimOffice::serving(Customer::with_years(3));
        office.quote(&[Item::new(ItemType::Amulet)]);
        let sword = Item::new(ItemType::Sword).cursed().with_enchantment(7);
        assert_eq!(office.quote(&[sword]), 160);
    }

    // --- Quote rejection ---

    #[test]
    fn rejects_a_quote_containing_an_unknown_item_type() {
        // The observable contract is a non-zero CLI exit with a stderr
        // message; in the library that is an error result naming the type.
        let rejected = ItemType::named("broomstick");
        assert!(rejected.is_err());
        assert!(rejected.unwrap_err().contains("broomstick"));
    }

    // --- Insurance sum and cap ---

    #[test]
    fn caps_payout_at_twice_the_summed_insurance_values() {
        // Insurance sum 1000 + 600 = 1600 G, so the cap is 3200 G; the
        // reimbursements of 1900 + 1900 G are cut back to it.
        let insured = [Item::new(ItemType::Sword), Item::new(ItemType::Amulet)];
        let damages = [
            Damage::to(ItemType::Sword, 2000),
            Damage::to(ItemType::Amulet, 2000),
        ];
        let settlement = settlement_over(&insured, &damages);
        assert_eq!(settlement.payout, 3200);
        assert_eq!(settlement.remaining_cap, 0);
    }

    #[test]
    fn sums_insurance_values_of_two_items_of_the_same_type() {
        // Insurance sum 2 x 1000 G, so the cap is 4000 G; the two
        // reimbursements of 2900 G each are cut back to it.
        let damages = [Damage::to(ItemType::Sword, 3000); 2];
        let settlement = settlement_over(&[Item::new(ItemType::Sword); 2], &damages);
        assert_eq!(settlement.payout, 4000);
        assert_eq!(settlement.remaining_cap, 0);
    }

    #[test]
    fn derives_the_cap_from_unmodified_insurance_values() {
        // The curse raises the premium to 165 G but leaves the insurance
        // value at 1000 G, so the cap stays 2000 G.
        let cursed_sword = Item::new(ItemType::Sword).cursed();
        let settlement = settlement_over(&[cursed_sword], &[Damage::to(ItemType::Sword, 5000)]);
        assert_eq!(settlement.payout, 2000);
    }

    #[test]
    fn excludes_the_block_discount_from_the_insurance_sum() {
        // Insurance sum 1000 + 3 x 250 = 1750 G, so the cap is 3500 G,
        // untouched by the block discount on the premium.
        let mut insured = vec![Item::new(ItemType::Sword)];
        insured.extend([Item::new(ItemType::Rune); 3]);
        let settlement = settlement_over(&insured, &[Damage::to(ItemType::Sword, 9000)]);
        assert_eq!(settlement.payout, 3500);
    }

    // --- Claim: standard reimbursement and deductible ---

    #[test]
    fn reimburses_damage_in_full_minus_the_deductible() {
        let sword = Item::new(ItemType::Sword).with_enchantment(3);
        let settlement = settlement_over(&[sword], &[Damage::to(ItemType::Sword, 500)]);
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn reimburses_component_damage_in_full_minus_the_deductible() {
        // A rune has neither an enchantment level nor a material, so no
        // special clause applies.
        let rune = Item::new(ItemType::Rune);
        let settlement = settlement_over(&[rune], &[Damage::to(ItemType::Rune, 200)]);
        assert_eq!(settlement.payout, 100);
    }

    #[test]
    fn applies_the_deductible_once_per_damaged_item() {
        let insured = [Item::new(ItemType::Sword), Item::new(ItemType::Amulet)];
        let damages = [
            Damage::to(ItemType::Sword, 500),
            Damage::to(ItemType::Amulet, 300),
        ];
        assert_eq!(settlement_over(&insured, &damages).payout, 600);
    }

    #[test]
    fn treats_each_damage_entry_of_the_same_type_separately() {
        let damages = [Damage::to(ItemType::Sword, 500); 2];
        assert_eq!(settlement_over(&[Item::new(ItemType::Sword); 2], &damages).payout, 800);
    }

    // --- Claim: special clauses ---

    #[test]
    fn halves_damage_for_highly_enchanted_items_before_the_deductible() {
        let sword = Item::new(ItemType::Sword).with_enchantment(9);
        let settlement = settlement_over(&[sword], &[Damage::to(ItemType::Sword, 1000)]);
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn applies_the_high_enchantment_clause_at_exactly_enchantment_eight() {
        let sword = Item::new(ItemType::Sword).with_enchantment(8);
        let settlement = settlement_over(&[sword], &[Damage::to(ItemType::Sword, 1000)]);
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn reimburses_dragon_material_damage_fully_before_the_deductible() {
        let sword = Item::new(ItemType::Sword)
            .made_of("dragon")
            .with_enchantment(5);
        let settlement = settlement_over(&[sword], &[Damage::to(ItemType::Sword, 800)]);
        assert_eq!(settlement.payout, 700);
    }

    #[test]
    fn lets_the_high_enchantment_clause_win_over_dragon_material() {
        let sword = Item::new(ItemType::Sword)
            .made_of("dragon")
            .with_enchantment(9);
        let settlement = settlement_over(&[sword], &[Damage::to(ItemType::Sword, 1000)]);
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn lets_the_high_enchantment_clause_win_at_exactly_enchantment_eight() {
        let sword = Item::new(ItemType::Sword)
            .made_of("dragon")
            .with_enchantment(8);
        let settlement = settlement_over(&[sword], &[Damage::to(ItemType::Sword, 1000)]);
        assert_eq!(settlement.payout, 400);
    }

    // --- Claim: cap exhaustion across successive claims ---

    #[test]
    fn reports_the_remaining_cap_after_a_claim() {
        let sword = Item::new(ItemType::Sword);
        let settlement = settlement_over(&[sword], &[Damage::to(ItemType::Sword, 1500)]);
        assert_eq!(settlement.payout, 1400);
        assert_eq!(settlement.remaining_cap, 600);
    }

    #[test]
    fn limits_a_later_payout_to_the_remaining_cap() {
        let mut office = ClaimOffice::serving(Customer::with_years(0));
        let (_, policy) = office.quote_policy(&[Item::new(ItemType::Sword)]);
        office.claim(policy, &[Damage::to(ItemType::Sword, 1500)]);
        let settlement = office
            .claim(policy, &[Damage::to(ItemType::Sword, 1500)])
            .unwrap();
        assert_eq!(settlement.payout, 600);
        assert_eq!(settlement.remaining_cap, 0);
    }

    // --- Claim rejection ---

    #[test]
    fn rejects_a_claim_for_an_item_not_covered_by_the_policy() {
        // The observable contract is a non-zero CLI exit with a stderr
        // message; in the library that is a rejected claim.
        let mut office = ClaimOffice::serving(Customer::with_years(0));
        let (_, policy) = office.quote_policy(&[Item::new(ItemType::Sword)]);
        let rejected = office.claim(policy, &[Damage::to(ItemType::Amulet, 200)]);
        assert!(rejected.is_none());
    }

    #[test]
    fn refuses_to_name_the_damaged_item_of_a_claim_by_an_unknown_type() {
        // A damage names its item by the very same wire vocabulary a quote's
        // items do, so MHPCO refuses an unlisted name at that one shared
        // boundary rather than twice over. The library fact is therefore the
        // same one the quote side asserts; what distinguishes the claim path
        // -- a claim step exiting non-zero on such a damage -- is observable
        // only at the CLI, and is owed by the scenario behaviors below.
        let damaged_item_type = ItemType::named("broomstick");
        assert!(damaged_item_type.is_err());
        assert!(damaged_item_type.unwrap_err().contains("broomstick"));
    }

    #[test]
    fn rejects_a_claim_with_more_damages_of_a_type_than_the_policy_covers() {
        let mut office = ClaimOffice::serving(Customer::with_years(0));
        let (_, policy) = office.quote_policy(&[Item::new(ItemType::Sword)]);
        let damages = [Damage::to(ItemType::Sword, 500); 2];
        assert!(office.claim(policy, &damages).is_none());
    }

    #[test]
    fn rejects_a_claim_with_a_negative_damage_amount() {
        // MHPCO records no damage below nothing; the refusal happens where a
        // reported amount is read, as the CLI's non-zero exit and stderr.
        let rejected = Damage::reported(ItemType::Sword, -200);
        assert!(rejected.is_err());
        assert!(rejected.unwrap_err().contains("-200"));
    }

    // --- Scenario / CLI contract ---

    #[test]
    fn returns_one_result_per_step_in_order() {
        let scenario = Scenario {
            customer: Customer::with_years(0),
            steps: vec![
                Step::Quote {
                    items: vec![Item::new(ItemType::Sword)],
                },
                Step::Quote {
                    items: vec![Item::new(ItemType::Amulet)],
                },
            ],
        };
        let results = run(&scenario).unwrap();
        assert_eq!(results.len(), 2);
        assert_eq!(results[0], StepResult::Quote { premium: 115 });
    }

    #[test]
    fn resolves_a_claim_against_the_policy_of_the_referenced_quote_step() {
        // The second quote is step 2, so the claim that names policy 2 must
        // settle against the amulet, not against the first policy.
        let scenario = Scenario {
            customer: Customer::with_years(0),
            steps: vec![
                Step::Quote {
                    items: vec![Item::new(ItemType::Sword)],
                },
                Step::Claim {
                    policy: 0,
                    damages: vec![Damage::to(ItemType::Sword, 500)],
                },
                Step::Quote {
                    items: vec![Item::new(ItemType::Amulet)],
                },
                Step::Claim {
                    policy: 2,
                    damages: vec![Damage::to(ItemType::Amulet, 300)],
                },
            ],
        };
        let results = run(&scenario).unwrap();
        assert_eq!(
            results[3],
            StepResult::Claim {
                payout: 200,
                remaining_cap: 1000,
            }
        );
    }

    #[test]
    fn serializes_scenario_results_in_the_documented_json_shape() {
        let stdin = r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {"op": "quote", "items": [
                    {"type": "amulet", "material": "silver",
                     "enchantment": 2, "cursed": false}
                ]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}]
                }}
            ]
        }"#;
        let stdout = settle_scenario_document(stdin).unwrap();
        assert_eq!(
            stdout,
            r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
        );
    }
}
