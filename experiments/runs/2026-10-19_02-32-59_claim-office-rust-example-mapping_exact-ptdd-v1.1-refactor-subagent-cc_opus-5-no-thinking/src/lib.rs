use serde::{Deserialize, Serialize};

/// An item a policy covers, as the office records it: the type it is listed
/// under in the price list, and the properties its clauses judge. The office
/// records an item's material because its reimbursement clauses speak of
/// items made of dragon material, and it is on the record of every insured
/// item whatever the clauses do with it. No clause reads the material: the
/// dragon-material clause reimburses in full, which is already what the
/// office admits when no clause reduces the damage, and where the clause
/// meets the enchantment clause the enchantment clause wins -- see
/// `reimbursable_damage_of`.
struct Item {
    item_type: String,
    cursed: bool,
    enchantment: i64,
    #[allow(dead_code, reason = "on the record of every insured item; no clause reads it")]
    material: String,
}

const PROCESSING_FEE: i64 = 5;

const FIRST_INSURANCE_SURCHARGE: f64 = 0.10;
const CURSE_SURCHARGE: f64 = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE: f64 = 0.30;
const LOYALTY_DISCOUNT: f64 = 0.20;
const LOYALTY_YEARS: i64 = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT: f64 = 0.15;
const HIGH_ENCHANTMENT_SURCHARGE_LEVEL: i64 = 5;

const SWORD_BASE_PREMIUM: f64 = 100.0;
const AMULET_BASE_PREMIUM: f64 = 60.0;
const STAFF_BASE_PREMIUM: f64 = 80.0;
const POTION_BASE_PREMIUM: f64 = 40.0;
const COMPONENT_BASE_PREMIUM: f64 = 25.0;
const SWORD_INSURANCE_VALUE: i64 = 1000;
const AMULET_INSURANCE_VALUE: i64 = 600;
const STAFF_INSURANCE_VALUE: i64 = 800;
const POTION_INSURANCE_VALUE: i64 = 400;
const COMPONENT_INSURANCE_VALUE: i64 = 250;
const PAYOUT_CAP_FACTOR: i64 = 2;
const DEDUCTIBLE: i64 = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_LEVEL: i64 = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT: f64 = 0.50;
const COMPONENT_BLOCK_SIZE: usize = 3;
const COMPONENT_BLOCK_BASE_PREMIUM: f64 = 60.0;

/// The MHPCO treats components -- runes and moonstones -- as a category of
/// their own, priced per component rather than per type. Component types enter
/// this predicate with their examples.
fn is_component(item: &Item) -> bool {
    matches!(item.item_type.as_str(), "rune" | "moonstone")
}

/// The MHPCO insures the item types its price list names and no others.
fn is_in_the_price_list(item_type: &str) -> bool {
    matches!(
        item_type,
        "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone"
    )
}

/// The MHPCO price list: the base premium in G for a single insured item. Main
/// item types are listed individually; every component carries the same flat
/// component premium. All four main types now have their examples, and a quote
/// over an unlisted type is refused before it reaches the list, so the
/// remaining arm prices the sword and nothing else -- it is written as a
/// fall-through rather than as a `"sword"` arm because the list is closed and a
/// `"sword"` arm would leave an unreachable residual behind it.
fn base_premium_of(item: &Item) -> f64 {
    if is_component(item) {
        return COMPONENT_BASE_PREMIUM;
    }
    match item.item_type.as_str() {
        "amulet" => AMULET_BASE_PREMIUM,
        "staff" => STAFF_BASE_PREMIUM,
        "potion" => POTION_BASE_PREMIUM,
        _ => SWORD_BASE_PREMIUM,
    }
}

/// What the customer's standing with the office is worth, as a single share of
/// the policy base premium. The office was asked whether "first insurance"
/// means the customer's first ever contract or the first time it sees this
/// item, and ruled for the item: every item in a quote is treated as a first
/// insurance, so the initial assessment surcharge is unconditional and a
/// long-standing customer pays it on a brand-new sword like anyone else. What
/// the years of business earn is the loyalty discount, taken against that
/// surcharge. This is the office's customer-history policy, and the rest of
/// the premium calculation does not need to know which clauses it is made of.
fn policy_modifier_rate_of(history: &CustomerHistory) -> f64 {
    let mut modifier_rate = FIRST_INSURANCE_SURCHARGE;
    if history.customer.years_with_mhpco >= LOYALTY_YEARS {
        modifier_rate -= LOYALTY_DISCOUNT;
    }
    if history.preceding_contracts > 0 {
        modifier_rate -= FOLLOW_UP_CONTRACT_DISCOUNT;
    }
    modifier_rate
}

/// Policy-wide modifiers apply to the policy base premium, the sum of all item
/// base premiums, at the single rate the customer's standing earns.
fn with_policy_modifiers(history: &CustomerHistory, policy_base_premium: f64) -> f64 {
    policy_base_premium + policy_base_premium * policy_modifier_rate_of(history)
}

/// A building block of 3 alike components is offered at a special base premium
/// instead of the per-component price.
fn alike_components_base_premium(count: usize) -> f64 {
    if count == COMPONENT_BLOCK_SIZE {
        return COMPONENT_BLOCK_BASE_PREMIUM;
    }
    count as f64 * COMPONENT_BASE_PREMIUM
}

/// The policy base premium is the sum of all item base premiums, except that
/// alike components are priced together so the block offer can apply.
fn policy_base_premium_of(items: &[Item]) -> f64 {
    let main_items: f64 = items
        .iter()
        .filter(|item| !is_component(item))
        .map(base_premium_of)
        .sum();
    let components: f64 = alike_component_groups_of(items)
        .into_iter()
        .map(alike_components_base_premium)
        .sum();
    main_items + components
}

/// Components count as alike when they are of exactly the same type, not
/// merely of the same family: a policy of 2 runes and 1 moonstone forms no
/// block, so the office prices the two kinds separately. This groups a
/// policy's components by type and reports how many are in each group, in
/// order of the groups' first appearance.
fn alike_component_groups_of(items: &[Item]) -> Vec<usize> {
    let mut groups: Vec<(&str, usize)> = Vec::new();
    for item in items.iter().filter(|item| is_component(item)) {
        match groups.iter_mut().find(|(alike, _)| *alike == item.item_type) {
            Some((_, count)) => *count += 1,
            None => groups.push((&item.item_type, 1)),
        }
    }
    groups.into_iter().map(|(_, count)| count).collect()
}

/// Only the final premium is rounded, and a premium is rounded up -- the
/// MHPCO's favor for money it collects. The processing fee is added at the very
/// end; being a whole number of G, it does not affect the rounding.
fn total_premium_of(premium_before_fee: f64) -> i64 {
    premium_before_fee.ceil() as i64 + PROCESSING_FEE
}

/// The office was asked whether a risk surcharge on one item of a multi-item
/// policy burdens the whole policy, and ruled that it does not: an
/// item-specific modifier is measured against the base premium of the affected
/// item alone. A policy of a cursed sword and a plain amulet therefore carries
/// a curse surcharge of 50 G -- 50 % of the sword's own 100 G base premium --
/// and not 80 G, half of the 160 G policy base premium.
fn item_surcharges_of(items: &[Item]) -> f64 {
    items.iter().map(item_surcharge_of).sum()
}

/// The risk surcharges an item carries: a curse adds 50 %, an enchantment at
/// or above the surcharge level adds 30 %, and an item that is both carries
/// both. The surcharge level is the premium side's own threshold; the claim
/// side judges enchantment against a separate level of its own.
fn item_surcharge_of(item: &Item) -> f64 {
    let mut surcharge_rate = 0.0;
    if item.cursed {
        surcharge_rate += CURSE_SURCHARGE;
    }
    if item.enchantment >= HIGH_ENCHANTMENT_SURCHARGE_LEVEL {
        surcharge_rate += HIGH_ENCHANTMENT_SURCHARGE;
    }
    base_premium_of(item) * surcharge_rate
}

/// How the two modifier families stack. By the office's scope ruling they are
/// measured against different bases, so they cannot be combined into one
/// percentage: the policy-wide modifiers scale the policy base premium, while
/// the item surcharges are shares of their own items' base premiums and are
/// added alongside. A cursed sword is therefore 100 + 10 % of 100 + 50 % of
/// 100, not 10 % of 150; a cursed sword beside a plain amulet is 160 + 10 % of
/// 160 + 50 % of 100.
fn premium_before_fee_of(history: &CustomerHistory, items: &[Item]) -> f64 {
    with_policy_modifiers(history, policy_base_premium_of(items)) + item_surcharges_of(items)
}

/// The single customer a scenario's policies belong to.
struct Customer {
    years_with_mhpco: i64,
}

/// The office's view of the customer at the moment of a quote: who they are
/// and how many contracts they already hold. The preceding-contract count is
/// not a property of the customer -- a scenario has one customer whose steps
/// are processed in order, so the count is what the office has on file when
/// this particular quote is drawn up. Together these are the facts the
/// customer-history policy reads.
struct CustomerHistory<'a> {
    customer: &'a Customer,
    preceding_contracts: usize,
}

/// The MHPCO price list: the insurance value in G of a single insured item --
/// the worth the office acknowledges when it pays out, as opposed to the price
/// it charges to carry the risk. The price list prints the two figures side by
/// side, but they are separate rulings and move separately: the block offer and
/// the premium modifiers both change what an item costs to insure while leaving
/// its acknowledged worth untouched. So this list stays apart from the base
/// premium list rather than being derived from it. Both columns are now
/// complete: all four main types have their acknowledged worth on file, and a
/// claim or quote over an unlisted type is refused before it reaches the list,
/// so the remaining arm values the sword and nothing else -- a fall-through
/// rather than a `"sword"` arm for the same reason the base premium list uses
/// one, the list being closed.
fn insurance_value_of(item: &Item) -> i64 {
    if is_component(item) {
        return COMPONENT_INSURANCE_VALUE;
    }
    match item.item_type.as_str() {
        "amulet" => AMULET_INSURANCE_VALUE,
        "staff" => STAFF_INSURANCE_VALUE,
        "potion" => POTION_INSURANCE_VALUE,
        _ => SWORD_INSURANCE_VALUE,
    }
}

/// The insurance sum is the sum of the insured items' insurance values. The
/// block offer discounts the premium only, never the insurance sum.
fn insurance_sum_of(items: &[Item]) -> i64 {
    items.iter().map(insurance_value_of).sum()
}

/// What the office reports for one processed step of a scenario.
#[derive(Debug, PartialEq, Eq)]
enum StepResult {
    Quote { premium: i64 },
    Claim { payout: i64, remaining_cap: i64 },
}

/// The scenario document the office reads: one customer and the steps to
/// process, in order.
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Scenario {
    customer: ReportedCustomer,
    steps: Vec<Step>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReportedCustomer {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: i64,
}

#[derive(Deserialize)]
#[serde(tag = "op", rename_all = "camelCase")]
enum Step {
    Quote { items: Vec<ReportedItem> },
    Claim { policy: usize, incident: Incident },
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReportedItem {
    #[serde(rename = "type")]
    item_type: String,
    #[serde(default)]
    material: String,
    #[serde(default)]
    enchantment: i64,
    #[serde(default)]
    cursed: bool,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Incident {
    /// The office records what an incident was caused by, because the schema
    /// names `cause` among an incident's fields and binds that name. No clause
    /// of the price list or of the reimbursement rules reads it: what the
    /// office pays turns on the damaged item and the amount, never on whether
    /// the dragon attacked or the fire spread. The field stays on the document
    /// type all the same, so that type mirrors the schema it transcribes
    /// rather than only the part the clauses happen to consult. A clause that
    /// priced or reimbursed by cause would be the change that makes it read;
    /// until then the office asks nothing of a report that omits it, no
    /// example calling for such a report to be refused.
    #[allow(dead_code, reason = "bound by the normative input schema; no clause reads it")]
    cause: String,
    damages: Vec<ReportedDamage>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ReportedDamage {
    item_type: String,
    amount: i64,
}

/// What one step of a scenario instructs the office to do, in the office's own
/// terms: draw up a policy over these insured items, or settle a claim of
/// these damages against the policy a named earlier step created. This is the
/// scenario's content once the document it arrived in has been read -- the
/// office processes instructions, not JSON, so the field names the schema
/// binds and the `serde` attributes that carry them stay on the document side
/// in `Step` and do not reach the processing rules.
enum Instruction {
    Quote { items: Vec<Item> },
    Claim { policy: usize, damages: Vec<Damage> },
}

/// A policy a quote step drew up: the items it insures and the running
/// account of what the office has paid out on it. The account is part of the
/// policy and not of the scenario that processes it, because the cap is a
/// per-policy total: the specification has a sword's policy answer two claims
/// of 1500 G with 1400 G and then 600 G, so what an earlier claim drew is a
/// fact the policy itself carries into the next one.
struct DrawnUpPolicy {
    insured_items: Vec<Item>,
    paid_so_far: i64,
}

impl DrawnUpPolicy {
    /// Settles a claim of these damages against this policy, which is one
    /// act and not two: the cap still available is what the policy has not
    /// yet paid, and a payout the office awards is paid out of it. So the
    /// policy's account is read and advanced here, where the settlement
    /// happens, rather than by the scenario that asks for it -- the
    /// specification's successive claims draw the cap down by what was
    /// actually awarded, which is a ruling of the cap and not of the step
    /// order. A reinstatement that restored part of the cap, or a cap drawn
    /// down by the desired rather than the awarded payout, would change this
    /// and nothing about how a scenario's steps are sequenced.
    fn settle_a_claim_of(&mut self, damages: &[Damage]) -> Result<Settlement, String> {
        let settlement = claim(&self.insured_items, self.paid_so_far, damages)?;
        self.paid_so_far += settlement.payout;
        Ok(settlement)
    }
}

/// The office's file of drawn-up policies, in which a policy is named by the
/// step that drew it up. The office was asked what a claim's `policy` names
/// and ruled for the step: the zero-based index of the quote step, not the
/// position of the policy among those drawn up -- a quote at step 2 is named
/// 2 even when it is only the second policy on file. So each policy is filed
/// under the number of the step that drew it up and found again by it. The
/// name is kept as a fact of the policy rather than left to its place in the
/// file, because the two differ: a scenario whose steps alternate quote and
/// claim files its second policy under 2, and only a recorded name says so.
///
/// The file answers two of the office's questions, and it is one fact asked
/// from two sides rather than two facts kept in step: a contract exists
/// exactly because a quote filed a policy, so the policies on file ARE the
/// contracts the customer holds. A claim reads the file by step to find the
/// policy to settle against; a quote asks how many policies stand on file to
/// learn how many contracts precede this one, which is what earns the
/// follow-up contract discount. The count is read off the file rather than
/// tallied beside it, so it cannot drift from what the file says. Only a
/// quote the office did not refuse reaches the file, so a refused quote is
/// neither claimable against nor counted as a preceding contract -- the same
/// ruling for both readings, because it is the same record.
#[derive(Default)]
struct PolicyFile {
    drawn_up: Vec<(usize, DrawnUpPolicy)>,
}

impl PolicyFile {
    /// Files a policy over these items under the number of the quote step
    /// that drew it up, which is the name a later claim calls it by.
    fn draw_up_a_policy_over(&mut self, drawn_up_by_step: usize, insured_items: Vec<Item>) {
        self.drawn_up.push((
            drawn_up_by_step,
            DrawnUpPolicy {
                insured_items,
                paid_so_far: 0,
            },
        ));
    }

    /// The policy a named step drew up, or the office's refusal when no step
    /// of that number drew one up.
    fn policy_drawn_up_by(&mut self, step: usize) -> Result<&mut DrawnUpPolicy, String> {
        self.drawn_up
            .iter_mut()
            .find(|(drawn_up_by_step, _)| *drawn_up_by_step == step)
            .map(|(_, policy)| policy)
            .ok_or_else(|| format!("no policy was created by step {step}"))
    }

    /// How many contracts the customer holds: one per policy on file.
    fn contracts_on_file(&self) -> usize {
        self.drawn_up.len()
    }
}

/// Processes a scenario's instructions in order and reports one result per
/// instruction. This is the office's scenario policy, and only that: the steps
/// are processed sequentially, each quote draws up a policy that a later claim
/// can name, and the premium a quote is charged depends on what the customer
/// already holds. Which policy a named step drew up, and how a step's number
/// becomes its policy's name, is the file's own knowledge -- see `PolicyFile`.
fn process_the_instructions(
    customer: &Customer,
    instructions: Vec<Instruction>,
) -> Result<Vec<StepResult>, String> {
    let mut results = Vec::new();
    let mut policies = PolicyFile::default();
    for (step, instruction) in instructions.into_iter().enumerate() {
        results.push(match instruction {
            Instruction::Quote { items } => {
                let history = CustomerHistory {
                    customer,
                    preceding_contracts: policies.contracts_on_file(),
                };
                let premium = quote(&history, &items)?;
                policies.draw_up_a_policy_over(step, items);
                StepResult::Quote { premium }
            }
            Instruction::Claim { policy, damages } => {
                let drawn_up = policies.policy_drawn_up_by(policy)?;
                let settlement = drawn_up.settle_a_claim_of(&damages)?;
                StepResult::Claim {
                    payout: settlement.payout,
                    remaining_cap: settlement.remaining_cap,
                }
            }
        });
    }
    Ok(results)
}

/// Reads a scenario document, settles it, and writes the results document the
/// office publishes. The two document sides are each one step of their own --
/// `run_scenario` reads the scenario in, `published_results_of` writes the
/// results out -- so a revision of either schema lands behind its own name and
/// not here.
pub fn settle_the_scenario(scenario: &str) -> Result<String, String> {
    let results = run_scenario(scenario)?;
    published_results_of(&results)
}

/// Writes the results document the office publishes. This is the counterpart of
/// `run_scenario` on the way out: the output schema's shape is `PublishedResults`
/// and `PublishedResult`, and rendering those to the document the office hands
/// back over the counter is this step. A revision of the published schema -- a
/// renamed field, a result the office reports differently -- is a change to this
/// side alone and leaves the processing rules and the reading desk untouched.
fn published_results_of(results: &[StepResult]) -> Result<String, String> {
    let published = PublishedResults {
        results: results.iter().map(PublishedResult::from).collect(),
    };
    serde_json::to_string(&published).map_err(|error| error.to_string())
}

/// The results document the office publishes: one result per step, in order.
#[derive(Serialize)]
struct PublishedResults {
    results: Vec<PublishedResult>,
}

/// One step's result as the office publishes it. The field names are the ones
/// the specification binds, so they are spelled here rather than derived.
#[derive(Serialize)]
#[serde(untagged)]
enum PublishedResult {
    Quote {
        premium: i64,
    },
    Claim {
        payout: i64,
        #[serde(rename = "remainingCap")]
        remaining_cap: i64,
    },
}

impl From<&StepResult> for PublishedResult {
    fn from(result: &StepResult) -> Self {
        match *result {
            StepResult::Quote { premium } => PublishedResult::Quote { premium },
            StepResult::Claim {
                payout,
                remaining_cap,
            } => PublishedResult::Claim {
                payout,
                remaining_cap,
            },
        }
    }
}

/// Reads a scenario document and reports one result per step. This is the
/// office's reading desk: it takes the document apart into the customer and
/// the instructions its steps give, and hands those to the processing rules.
fn run_scenario(scenario: &str) -> Result<Vec<StepResult>, String> {
    let scenario: Scenario = serde_json::from_str(scenario).map_err(|error| error.to_string())?;
    let customer = Customer {
        years_with_mhpco: scenario.customer.years_with_mhpco,
    };
    let instructions: Vec<Instruction> = scenario.steps.iter().map(instruction_of).collect();
    process_the_instructions(&customer, instructions)
}

/// Translates one reported step into the instruction it gives the office.
fn instruction_of(step: &Step) -> Instruction {
    match step {
        Step::Quote { items } => Instruction::Quote {
            items: insured_items_of(items),
        },
        Step::Claim { policy, incident } => Instruction::Claim {
            policy: *policy,
            damages: reported_damages_of(&incident.damages),
        },
    }
}

/// Translates the items a quote step reports into insured items.
fn insured_items_of(reported: &[ReportedItem]) -> Vec<Item> {
    reported
        .iter()
        .map(|item| Item {
            item_type: item.item_type.clone(),
            cursed: item.cursed,
            enchantment: item.enchantment,
            material: item.material.clone(),
        })
        .collect()
}

/// Translates the damages an incident reports into damages.
fn reported_damages_of(reported: &[ReportedDamage]) -> Vec<Damage> {
    reported
        .iter()
        .map(|damage| Damage {
            item_type: damage.item_type.clone(),
            amount: damage.amount,
        })
        .collect()
}

/// One item's damage reported in an incident.
struct Damage {
    item_type: String,
    amount: i64,
}

/// What the office settles on a claim: the payout in G and the cap still
/// available on the policy afterwards.
#[derive(Debug, PartialEq, Eq)]
struct Settlement {
    payout: i64,
    remaining_cap: i64,
}

/// The office takes no damage report for a negative amount: a damage is what
/// the incident cost, so a negative figure is not a smaller claim but an
/// unreadable report, and the whole claim is refused.
fn admit_the_reported_damages(damages: &[Damage]) -> Result<(), String> {
    match damages.iter().find(|damage| damage.amount < 0) {
        Some(damage) => Err(format!("negative damage amount: {}", damage.amount)),
        None => Ok(()),
    }
}

/// How the office settles a claim against this policy. One incident may
/// damage several insured items, and the office settles each damaged item on
/// its own terms before adding the amounts up: a dragon attack on a sword and
/// an amulet is settled as two damages, not as one. The awarded sum is then
/// held back to the cap still available, which is the policy's cap less what
/// earlier claims have already drawn on it -- a policy may be claimed against
/// more than once, so what has been paid so far is a fact of every claim, nil
/// on the first.
fn claim(
    items: &[Item],
    paid_so_far: i64,
    damages: &[Damage],
) -> Result<Settlement, String> {
    admit_the_reported_damages(damages)?;
    let cap_available = payout_cap_of(items)? - paid_so_far;
    let payout = desired_payout_of(items, damages)?.min(cap_available);
    Ok(Settlement {
        payout,
        remaining_cap: cap_available - payout,
    })
}

/// What the reimbursement clauses award for an incident, before the policy's
/// cap is consulted. The office settles each damaged item on its own terms and
/// adds the amounts up; this is the sum the office desires to pay, which the
/// cap may then hold back -- the spec speaks of a desired payout being reduced
/// to the cap remaining, so the awarded sum is a figure of its own and not
/// merely an intermediate step inside the cap accounting.
///
/// The insured items start out unanswered and each assignment strikes one off,
/// which is how the office holds an insured item to a single damage; see
/// `insured_item_answering`.
fn desired_payout_of(items: &[Item], damages: &[Damage]) -> Result<i64, String> {
    let mut unanswered: Vec<&Item> = items.iter().collect();
    let mut desired_payout = 0;
    for damage in damages {
        let damaged_item = insured_item_answering(&mut unanswered, damage)?;
        desired_payout += reimbursement_of(damaged_item, damage);
    }
    Ok(desired_payout)
}

/// Which insured item answers a reported damage, and when the office refuses
/// the claim instead. An insured item answers at most one damage: a policy
/// covering one sword cannot answer two sword damages. The office enforces
/// that by striking the item it assigns off the list of those still
/// unanswered, so each damage is assigned an item of its own and a policy
/// covering two swords answers two sword damages.
///
/// Both ways a damage can fail to be assigned are refused in the same words,
/// naming the type: a policy that covers no sword at all and a policy whose
/// only sword has already answered an earlier damage are, from the claim's
/// side, the same objection -- this damage has no insured item to be settled
/// against, so the office declines to cover it and refuses the claim whole.
/// The office is asked only for a refusal the CLI can report and exit on, and
/// it has no finer ruling to make between the two grounds. A ruling that did
/// distinguish them -- different wording per ground, or refusing only the
/// surplus damage rather than the whole claim -- would be the change that
/// splits this into two objections.
fn insured_item_answering<'a>(
    unanswered: &mut Vec<&'a Item>,
    damage: &Damage,
) -> Result<&'a Item, String> {
    let position = unanswered
        .iter()
        .position(|item| item.item_type == damage.item_type);
    match position {
        Some(position) => Ok(unanswered.remove(position)),
        None => Err(format!(
            "item not covered by the policy: {}",
            damage.item_type
        )),
    }
}

/// What the office reimburses for one damaged item: the damage amount less the
/// deductible. The office charges the deductible per damage event, and it
/// counts each damaged item as a damage event of its own -- two items damaged
/// by a single dragon attack bear the deductible twice, once each. A damage
/// smaller than the deductible is reimbursed with nothing rather than turned
/// into a debt: the deductible is a share of the damage the customer bears,
/// not a charge the office levies.
///
/// Both the deductible and that floor therefore settle one damage event, which
/// is why they are withheld here rather than from the claim's total. A small
/// damage beside a large one contributes nothing of its own and does not eat
/// into what the large one is awarded: an incident damaging a rune by 50 G and
/// a sword by 1000 G is reimbursed 0 G and 900 G, not 850 G in all, because the
/// deductible unspent on the small event is not charged against the other. A
/// deductible levied once per incident, or a shortfall the office carried from
/// one event to the next, would be the change that moves both out of here.
fn reimbursement_of(damaged_item: &Item, damage: &Damage) -> i64 {
    (reimbursable_damage_of(damaged_item, damage) - DEDUCTIBLE).max(0)
}

/// How much of the reported damage the office admits before the deductible --
/// which of its reimbursement clauses governs, and what that clause admits.
/// The office has two: damage to an item enchanted at or above the
/// reimbursement level is admitted at half, and damage to an item made of
/// dragon material is reimbursed in full. Only the enchantment clause appears
/// as a branch here, and that is the whole clause set faithfully, not a
/// clause left out:
///
/// - Full reimbursement IS the dragon-material outcome, and it is also what
///   the office admits when no clause reduces the damage. The two clauses
///   therefore differ in which items they name, not in what they pay, so a
///   separate dragon-material branch would compute the same amount the
///   fall-through already computes.
/// - Where both clauses name the same item, the halving clause governs: a
///   dragon-material sword enchanted at the reimbursement level is admitted at
///   half, not in full. Ranking the enchantment clause first is what makes the
///   collapse above sound, because it leaves the dragon clause reachable only
///   where it agrees with the fall-through.
///
/// So this stays one decision with one discriminating predicate. A third
/// clause, or a clause whose share were neither half nor full, would break the
/// collapse and force the clause set to become visible structure.
///
/// The reimbursement level is the claim side's own threshold, set higher than
/// the level at which the premium side charges a risk surcharge: the office
/// surcharges an enchantment of 5 but only halves its reimbursement from 8.
fn reimbursable_damage_of(damaged_item: &Item, damage: &Damage) -> i64 {
    let highly_enchanted =
        damaged_item.enchantment >= HIGH_ENCHANTMENT_REIMBURSEMENT_LEVEL;
    if highly_enchanted {
        return admitted_damage_of(damage.amount as f64 * HIGH_ENCHANTMENT_REIMBURSEMENT);
    }
    damage.amount
}

/// An admitted damage is rounded down -- the MHPCO's favor for money it pays
/// out, the mirror of the rounding up a premium gets in `total_premium_of`.
/// This is the office's house-wide favor ruling, not a reimbursement clause:
/// it is the direction a fraction is resolved in, whatever clause produced the
/// fraction. Rounding sits here, at the halving clause, because that clause is
/// the only step of a settlement that can yield a fraction at all -- the
/// deductible, the insurance values and the cap are whole G throughout -- so
/// rounding the share the office admits and rounding the final payout are the
/// same figure. A clause admitting some other share would arrive here too; a
/// fractional deductible or cap would move the ruling to the final payout.
fn admitted_damage_of(admitted_share: f64) -> i64 {
    admitted_share.floor() as i64
}

/// The total payout per policy is capped at twice the insurance sum.
fn payout_cap_of(items: &[Item]) -> Result<i64, String> {
    Ok(insurance_sum_of(items) * PAYOUT_CAP_FACTOR)
}

/// Whether the office will entertain a policy over these items at all. The
/// office insures the types its price list names and no others, so an item it
/// does not recognise is refused rather than priced -- a quote that lists a
/// broomstick yields no premium. The office names the offending type in its
/// refusal; which types it admits is the price list's own knowledge, read
/// here rather than restated.
fn admit_the_listed_items(items: &[Item]) -> Result<(), String> {
    match items
        .iter()
        .find(|item| !is_in_the_price_list(&item.item_type))
    {
        Some(unlisted) => Err(format!("unknown item type: {}", unlisted.item_type)),
        None => Ok(()),
    }
}

/// The premium in G the office charges for insuring these items, given what it
/// has on file about the customer.
///
/// A refusal is carried as the office's own description of what it objects to.
/// The office refuses documents for several unrelated reasons -- an unlisted
/// item type here, a damage outside the policy on the claim side -- but no
/// caller distinguishes them: the specification asks only that a refusal reach
/// stderr and the exit status be non-zero, so every reason is rendered the same
/// way. A named error type would be built at each refusal and flattened back to
/// its description at the one place that reports it, which relocates the
/// wording without giving any caller a decision it can make. A caller that had
/// to tell the reasons apart -- a different exit code per reason, a retry on
/// some but not others -- would be the change that earns the type.
fn quote(history: &CustomerHistory, items: &[Item]) -> Result<i64, String> {
    admit_the_listed_items(items)?;
    Ok(total_premium_of(premium_before_fee_of(history, items)))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn item(item_type: &str) -> Item {
        Item {
            item_type: item_type.to_string(),
            cursed: false,
            enchantment: 0,
            material: String::new(),
        }
    }

    fn made_of(item: Item, material: &str) -> Item {
        Item {
            material: material.to_string(),
            ..item
        }
    }

    fn enchanted(item: Item, enchantment: i64) -> Item {
        Item { enchantment, ..item }
    }

    fn damage(item_type: &str, amount: i64) -> Damage {
        Damage {
            item_type: item_type.to_string(),
            amount,
        }
    }

    fn cursed(item: Item) -> Item {
        Item {
            cursed: true,
            ..item
        }
    }

    /// A customer the office has no history with: no years of business, so no
    /// loyalty discount. The premium examples that say nothing about customer
    /// history are quoted for this customer.
    fn newcomer() -> Customer {
        Customer {
            years_with_mhpco: 0,
        }
    }

    /// This customer's first contract: nothing preceding it on file.
    fn first_contract_of(customer: &Customer) -> CustomerHistory<'_> {
        CustomerHistory {
            customer,
            preceding_contracts: 0,
        }
    }

    // --- Base premiums per item type (price list) ---

    #[test]
    fn empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[]), Ok(5));
    }

    #[test]
    fn plain_sword_has_base_premium_of_100() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[item("sword")]), Ok(115));
    }

    #[test]
    fn plain_amulet_has_base_premium_of_60() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[item("amulet")]), Ok(71));
    }

    #[test]
    fn plain_staff_has_base_premium_of_80() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[item("staff")]), Ok(93));
    }

    #[test]
    fn plain_potion_has_base_premium_of_40() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[item("potion")]), Ok(49));
    }

    #[test]
    fn single_rune_has_base_premium_of_25() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[item("rune")]), Ok(33));
    }

    #[test]
    fn single_moonstone_has_base_premium_of_25() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[item("moonstone")]), Ok(33));
    }

    // --- Building block of 3 alike components ---

    #[test]
    fn two_runes_have_base_premium_of_50() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[item("rune"), item("rune")]), Ok(60));
    }

    #[test]
    fn three_runes_form_a_block_with_base_premium_of_60() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[item("rune"), item("rune"), item("rune")]), Ok(71));
    }

    #[test]
    fn four_runes_have_no_block_and_base_premium_of_100() {
        let runes = [item("rune"), item("rune"), item("rune"), item("rune")];
        assert_eq!(quote(&first_contract_of(&newcomer()), &runes), Ok(115));
    }

    #[test]
    fn seven_runes_have_base_premium_of_175() {
        let runes: Vec<Item> = (0..7).map(|_| item("rune")).collect();
        assert_eq!(quote(&first_contract_of(&newcomer()), &runes), Ok(198));
    }

    #[test]
    fn mixed_component_types_do_not_form_a_block() {
        let components = [item("rune"), item("rune"), item("moonstone")];
        assert_eq!(quote(&first_contract_of(&newcomer()), &components), Ok(88));
    }

    #[test]
    fn two_separate_blocks_of_alike_components_cost_120() {
        let components = [
            item("rune"),
            item("rune"),
            item("rune"),
            item("moonstone"),
            item("moonstone"),
            item("moonstone"),
        ];
        assert_eq!(quote(&first_contract_of(&newcomer()), &components), Ok(137));
    }

    // --- Item-specific premium modifiers ---

    #[test]
    fn cursed_item_adds_a_fifty_percent_risk_surcharge() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[cursed(item("sword"))]), Ok(165));
    }

    #[test]
    fn enchantment_of_exactly_five_adds_a_thirty_percent_surcharge() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[enchanted(item("sword"), 5)]), Ok(145));
    }

    #[test]
    fn enchantment_of_four_adds_no_high_enchantment_surcharge() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[enchanted(item("sword"), 4)]), Ok(115));
    }

    #[test]
    fn cursed_and_highly_enchanted_item_adds_both_surcharges() {
        assert_eq!(quote(&first_contract_of(&newcomer()), &[cursed(enchanted(item("sword"), 5))]), Ok(195));
    }

    #[test]
    fn item_modifiers_apply_only_to_the_affected_items_base_premium() {
        // 160 G policy base + 50 G curse (50 % of the sword's 100 G base, not of
        // the policy total) + 16 G first insurance (10 % of 160 G) + 5 G fee.
        let items = [cursed(item("sword")), item("amulet")];
        assert_eq!(quote(&first_contract_of(&newcomer()), &items), Ok(231));
    }

    // --- Policy-wide premium modifiers ---

    #[test]
    fn loyalty_discount_applies_at_exactly_two_years() {
        // 100 G base - 20 G loyalty + 10 G first insurance + 5 G fee.
        let customer = Customer {
            years_with_mhpco: 2,
        };
        assert_eq!(quote(&first_contract_of(&customer), &[item("sword")]), Ok(95));
    }

    #[test]
    fn loyalty_discount_does_not_apply_below_two_years() {
        let customer = Customer {
            years_with_mhpco: 1,
        };
        assert_eq!(quote(&first_contract_of(&customer), &[item("sword")]), Ok(115));
    }

    #[test]
    fn first_insurance_surcharge_applies_to_each_quoted_item() {
        // Each item in a quote is treated as a first insurance regardless of
        // customer history: 100 G base - 20 G loyalty + 10 G first insurance.
        let long_standing = Customer {
            years_with_mhpco: 3,
        };
        assert_eq!(quote(&first_contract_of(&long_standing), &[item("sword")]), Ok(95));
    }

    #[test]
    fn follow_up_contract_discount_applies_from_the_second_quote_on() {
        // The customer's second contract: 100 G base + 10 G first insurance
        // - 15 G follow-up contract discount + 5 G fee.
        let second_contract = CustomerHistory {
            customer: &newcomer(),
            preceding_contracts: 1,
        };
        assert_eq!(quote(&second_contract, &[item("sword")]), Ok(100));
    }

    #[test]
    fn processing_fee_is_added_at_the_very_end() {
        // The fee is added after the modifiers, so a loyal customer's discount
        // never reduces it: an empty policy still costs exactly the fee.
        let loyal = Customer {
            years_with_mhpco: 10,
        };
        assert_eq!(quote(&first_contract_of(&loyal), &[]), Ok(5));
    }

    // --- Rounding of premiums ---

    #[test]
    fn premium_rounds_up_in_the_offices_favor() {
        // 7 runes: 175 G base + 17.50 G first insurance = 192.50 G, which the
        // office rounds up to 193 G before adding the 5 G fee.
        let runes: Vec<Item> = (0..7).map(|_| item("rune")).collect();
        let customer = newcomer();
        assert_eq!(quote(&first_contract_of(&customer), &runes), Ok(198));
    }

    // --- Premium integration examples ---

    #[test]
    fn newcomer_with_a_cursed_sword_pays_165() {
        // 100 G base + 50 G curse + 10 G first insurance + 5 G fee. The
        // sword's steel material does not enter the premium calculation.
        let customer = newcomer();
        let sword = cursed(enchanted(item("sword"), 3));
        assert_eq!(quote(&first_contract_of(&customer), &[sword]), Ok(165));
    }

    #[test]
    fn long_standing_customers_second_contract_costs_160() {
        // 100 G base + 50 G curse + 30 G high enchantment - 20 G loyalty
        // + 10 G first insurance - 15 G follow-up contract + 5 G fee.
        let customer = Customer {
            years_with_mhpco: 3,
        };
        let history = CustomerHistory {
            customer: &customer,
            preceding_contracts: 1,
        };
        let sword = cursed(enchanted(item("sword"), 7));
        assert_eq!(quote(&history, &[sword]), Ok(160));
    }

    // --- Insurance sum and cap ---

    #[test]
    fn insurance_sum_is_the_sum_of_item_values_and_the_cap_is_twice_that() {
        // Insurance sum 1000 G + 600 G = 1600 G; the payout cap is twice that.
        let items = [item("sword"), item("amulet")];
        assert_eq!(payout_cap_of(&items), Ok(3200));
    }

    #[test]
    fn two_items_of_the_same_type_both_count_toward_the_insurance_sum() {
        let swords = [item("sword"), item("sword")];
        assert_eq!(payout_cap_of(&swords), Ok(4000));
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        // The cursed sword's premium is 165 G, but its cap rests on the
        // unmodified 1000 G insurance value.
        let policy = [cursed(item("sword"))];
        let customer = newcomer();
        assert_eq!(quote(&first_contract_of(&customer), &policy), Ok(165));
        assert_eq!(payout_cap_of(&policy), Ok(2000));
    }

    #[test]
    fn component_block_discount_does_not_reduce_the_insurance_sum() {
        // Insurance sum 1000 G + 3 x 250 G = 1750 G, cap 3500 G: the block
        // offer discounts the premium only.
        let policy = [item("sword"), item("rune"), item("rune"), item("rune")];
        assert_eq!(payout_cap_of(&policy), Ok(3500));
    }

    #[test]
    fn staff_has_insurance_value_of_800() {
        assert_eq!(payout_cap_of(&[item("staff")]), Ok(1600));
    }

    #[test]
    fn potion_has_insurance_value_of_400() {
        assert_eq!(payout_cap_of(&[item("potion")]), Ok(800));
    }

    // --- Claim processing: standard reimbursement and deductible ---

    #[test]
    fn standard_damage_is_fully_reimbursed_minus_the_deductible() {
        // Full reimbursement minus the 100 G deductible; no special clause.
        let policy = [enchanted(item("sword"), 3)];
        let damages = [damage("sword", 500)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 400,
                remaining_cap: 1600,
            })
        );
    }

    #[test]
    fn component_damage_is_reimbursed_minus_the_deductible() {
        // A rune has no enchantment level and no material, so no special
        // clause applies: 200 G less the 100 G deductible.
        let policy = [item("rune")];
        let damages = [damage("rune", 200)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 100,
                remaining_cap: 400,
            })
        );
    }

    #[test]
    fn the_deductible_applies_once_per_damaged_item() {
        // A dragon attack damages both insured items: (500 - 100) + (300 - 100).
        let policy = [item("sword"), item("amulet")];
        let damages = [damage("sword", 500), damage("amulet", 300)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 600,
                remaining_cap: 2600,
            })
        );
    }

    #[test]
    fn repeated_damages_of_the_same_type_each_carry_a_deductible() {
        // Two swords insured, both damaged: (500 - 100) twice.
        let policy = [item("sword"), item("sword")];
        let damages = [damage("sword", 500), damage("sword", 500)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 800,
                remaining_cap: 3200,
            })
        );
    }

    // --- Claim processing: special clauses ---

    #[test]
    fn high_enchantment_damage_is_reimbursed_at_fifty_percent() {
        // 50 % of 1000 G, then the 100 G deductible.
        let policy = [enchanted(item("sword"), 9)];
        let damages = [damage("sword", 1000)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 400,
                remaining_cap: 1600,
            })
        );
    }

    #[test]
    fn enchantment_of_seven_does_not_trigger_the_fifty_percent_clause() {
        // Below the reimbursement level the office admits the damage in full.
        let policy = [enchanted(item("sword"), 7)];
        let damages = [damage("sword", 1000)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 900,
                remaining_cap: 1100,
            })
        );
    }

    #[test]
    fn dragon_material_damage_is_fully_reimbursed() {
        // Only the dragon-material clause applies: 800 G in full, then the
        // 100 G deductible.
        let policy = [made_of(enchanted(item("sword"), 5), "dragon")];
        let damages = [damage("sword", 800)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 700,
                remaining_cap: 1300,
            })
        );
    }

    #[test]
    fn high_enchantment_wins_over_dragon_material_at_exactly_eight() {
        // Both clauses apply; the 50 % rule wins, then the deductible.
        let policy = [made_of(enchanted(item("sword"), 8), "dragon")];
        let damages = [damage("sword", 1000)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 400,
                remaining_cap: 1600,
            })
        );
    }

    #[test]
    fn high_enchantment_wins_over_dragon_material() {
        // Both clauses apply; the 50 % rule wins: 500 G less the deductible.
        let policy = [made_of(enchanted(item("sword"), 9), "dragon")];
        let damages = [damage("sword", 1000)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 400,
                remaining_cap: 1600,
            })
        );
    }

    #[test]
    fn damage_below_the_deductible_pays_nothing() {
        // The spec states no floor, but a deductible reduces a reimbursement
        // and cannot create a debt: a 50 G damage against the 100 G
        // deductible pays nothing and leaves the cap untouched. A negative
        // payout would also raise the remaining cap, contradicting a cap that
        // successive claims draw down.
        let policy = [item("rune")];
        let damages = [damage("rune", 50)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 0,
                remaining_cap: 500,
            })
        );
    }

    // --- Claim processing: cap exhaustion and rounding ---

    #[test]
    fn a_claim_reports_the_remaining_cap() {
        // Cap 2000 G; the claim pays 1500 - 100 = 1400 G, leaving 600 G.
        let policy = [item("sword")];
        let damages = [damage("sword", 1500)];
        let settlement = Settlement {
            payout: 1400,
            remaining_cap: 600,
        };
        assert_eq!(claim(&policy, 0, &damages), Ok(settlement));
    }

    #[test]
    fn a_later_claim_is_reduced_to_the_remaining_cap() {
        // Cap 2000 G. The first claim leaves 600 G, so the second claim's
        // desired 1400 G is reduced to the remaining 600 G.
        let policy = [item("sword")];
        let damages = [damage("sword", 1500)];
        assert_eq!(
            claim(&policy, 1400, &damages),
            Ok(Settlement {
                payout: 600,
                remaining_cap: 0,
            })
        );
    }

    #[test]
    fn payout_rounds_down_in_the_offices_favor() {
        // 50 % of 901 G is 450.50 G, which the office rounds down to 450 G
        // before withholding the 100 G deductible.
        let policy = [enchanted(item("sword"), 9)];
        let damages = [damage("sword", 901)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Ok(Settlement {
                payout: 350,
                remaining_cap: 1650,
            })
        );
    }

    // --- Rejections: quote ---

    #[test]
    fn quoting_an_unknown_item_type_is_rejected() {
        // The spec says only that the CLI exits non-zero and writes an error
        // description; the library's observable contract is an Err whose
        // message names the offending type.
        let customer = newcomer();
        let result = quote(&first_contract_of(&customer), &[item("broomstick")]);
        assert_eq!(result, Err("unknown item type: broomstick".to_string()));
    }

    // --- Rejections: claim ---

    #[test]
    fn claiming_for_an_item_outside_the_policy_is_rejected() {
        let policy = [item("sword")];
        let damages = [damage("amulet", 300)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Err("item not covered by the policy: amulet".to_string())
        );
    }

    #[test]
    fn claiming_for_an_unknown_item_type_is_rejected() {
        // An unknown type is covered by no policy, so the claim is refused on
        // the same ground as any item the policy does not cover.
        let policy = [item("sword")];
        let damages = [damage("broomstick", 300)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Err("item not covered by the policy: broomstick".to_string())
        );
    }

    #[test]
    fn claiming_more_damages_of_a_type_than_insured_is_rejected() {
        // Only one sword is insured, so the second sword damage has no
        // insured item left to settle against and the whole claim is refused.
        let policy = [item("sword")];
        let damages = [damage("sword", 500), damage("sword", 500)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Err("item not covered by the policy: sword".to_string())
        );
    }

    #[test]
    fn a_negative_damage_amount_is_rejected() {
        let policy = [item("sword")];
        let damages = [damage("sword", -200)];
        assert_eq!(
            claim(&policy, 0, &damages),
            Err("negative damage amount: -200".to_string())
        );
    }

    // --- Scenario runner and CLI contract ---

    #[test]
    fn a_scenario_produces_one_result_per_step_in_order() {
        // The spec's schema example: a 5-year customer insures a silver
        // amulet, then claims 200 G against it.
        let scenario = r#"{
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
        let results = run_scenario(scenario).expect("the scenario is valid");
        assert_eq!(results.len(), 2);
    }

    #[test]
    fn a_scenarios_later_quote_carries_the_follow_up_discount() {
        // The customer's second quote in the scenario: 100 G base + 50 G curse
        // + 30 G high enchantment - 20 G loyalty + 10 G first insurance
        // - 15 G follow-up contract + 5 G fee.
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 3},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "quote", "items": [
                    {"type": "sword", "material": "steel",
                     "enchantment": 7, "cursed": true}
                ]}
            ]
        }"#;
        let results = run_scenario(scenario).expect("the scenario is valid");
        assert_eq!(results[1], StepResult::Quote { premium: 160 });
    }

    #[test]
    fn successive_claim_steps_exhaust_the_policy_cap() {
        // Cap 2000 G. The first claim pays 1400 G; the second claim's desired
        // 1400 G is reduced to the 600 G the cap has left.
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 1500}]
                }},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 1500}]
                }}
            ]
        }"#;
        let results = run_scenario(scenario).expect("the scenario is valid");
        assert_eq!(
            results[1],
            StepResult::Claim {
                payout: 1400,
                remaining_cap: 600,
            }
        );
        assert_eq!(
            results[2],
            StepResult::Claim {
                payout: 600,
                remaining_cap: 0,
            }
        );
    }

    #[test]
    fn a_claim_step_refers_to_its_policy_by_step_index() {
        // The policy field is the zero-based index of the QUOTE STEP, not the
        // position of the policy among those drawn up: step 2's policy is
        // named 2 even though it is only the second policy on file.
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "amulet"}]},
                {"op": "claim", "policy": 0, "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 200}]
                }},
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "claim", "policy": 2, "incident": {
                    "cause": "dragon attack",
                    "damages": [{"itemType": "sword", "amount": 1500}]
                }}
            ]
        }"#;
        let results = run_scenario(scenario).expect("the scenario is valid");
        assert_eq!(
            results[3],
            StepResult::Claim {
                payout: 1400,
                remaining_cap: 600,
            }
        );
    }

    #[test]
    fn the_schema_example_scenario_serializes_to_the_documented_shape() {
        let scenario = r#"{
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
        // The spec's schema example fixes the document shape, not the figures.
        // For this 5-year customer the amulet costs 60 G base - 12 G loyalty
        // + 6 G first insurance + 5 G fee = 59 G; the claim pays 200 - 100 G
        // against a 1200 G cap.
        assert_eq!(
            settle_the_scenario(scenario),
            Ok(r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
                .to_string())
        );
    }
}
