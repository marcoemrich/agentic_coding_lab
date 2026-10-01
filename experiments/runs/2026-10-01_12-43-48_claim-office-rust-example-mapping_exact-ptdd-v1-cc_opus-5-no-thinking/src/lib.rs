const PROCESSING_FEE: u32 = 5;

mod scenario;

pub use scenario::run_scenario;

pub struct Customer {
    pub years_with_mhpco: u32,
}

impl Customer {
    pub fn with_years(years_with_mhpco: u32) -> Self {
        Self { years_with_mhpco }
    }
}

#[derive(Clone)]
pub struct Item {
    pub item_type: String,
    pub material: String,
    pub cursed: bool,
    pub enchantment: u32,
}

impl Item {
    pub fn of_type(item_type: &str) -> Self {
        Self {
            item_type: item_type.to_string(),
            material: String::new(),
            cursed: false,
            enchantment: 0,
        }
    }

    pub fn material(mut self, material: &str) -> Self {
        self.material = material.to_string();
        self
    }

    pub fn enchantment(mut self, level: u32) -> Self {
        self.enchantment = level;
        self
    }

    pub fn cursed(self) -> Self {
        self.cursed_if(true)
    }

    pub fn cursed_if(mut self, cursed: bool) -> Self {
        self.cursed = cursed;
        self
    }
}

const FIRST_INSURANCE_SURCHARGE_RATE: f64 = 0.10;
const CURSE_SURCHARGE_RATE: f64 = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE_RATE: f64 = 0.30;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL: u32 = 5;
const LOYALTY_DISCOUNT_RATE: f64 = 0.20;
const LOYALTY_YEARS: u32 = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE: f64 = 0.15;
/// The MHPCO pays at most this multiple of a policy's insurance sum.
const PAYOUT_CAP_MULTIPLE: u32 = 2;
/// Withheld from every single damage event.
const DEDUCTIBLE: f64 = 100.0;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE: f64 = 0.50;
const HIGH_ENCHANTMENT_CLAIM_LEVEL: u32 = 8;
const FULL_REIMBURSEMENT_RATE: f64 = 1.0;

pub struct Damage {
    pub item_type: String,
    pub amount: i64,
}

impl Damage {
    pub fn to(item_type: &str, amount: i64) -> Self {
        Self {
            item_type: item_type.to_string(),
            amount,
        }
    }

    /// A damage report states how much harm an item suffered, so a negative
    /// amount is not a damage the MHPCO can process.
    fn check_reportable(&self) -> Result<(), String> {
        if self.amount < 0 {
            return Err(format!("{} is not a valid damage amount", self.amount));
        }
        Ok(())
    }
}

#[derive(Debug)]
pub struct ClaimResult {
    pub payout: u32,
    pub remaining_cap: u32,
}

/// Holds the policies the MHPCO has written for one customer during a
/// scenario, so that each contract knows whether it follows an earlier one.
/// One policy the MHPCO has written: the items it covers and the payout cap
/// still available on it.
struct Policy {
    items: Vec<Item>,
    remaining_cap: u32,
}

impl Policy {
    /// Pays what is reimbursed, up to the cap still available on this policy,
    /// and draws the payout from that cap.
    fn settle(&mut self, reimbursed: u32) -> ClaimResult {
        let payout = reimbursed.min(self.remaining_cap);
        self.remaining_cap -= payout;
        ClaimResult {
            payout,
            remaining_cap: self.remaining_cap,
        }
    }

    /// What the MHPCO reimburses for a whole incident. Each reported damage is
    /// settled against a distinct insured item, so an incident cannot claim
    /// more items of a type than this policy covers.
    fn total_reimbursement(&self, damages: &[Damage]) -> Result<f64, String> {
        let mut unclaimed: Vec<&Item> = self.items.iter().collect();
        let mut reimbursed = 0.0;
        for damage in damages {
            damage.check_reportable()?;
            let claimed = Self::insured_item_for(&unclaimed, damage)?;
            reimbursed += reimbursement(damage, unclaimed.remove(claimed));
        }
        Ok(reimbursed)
    }

    /// Where the insured item a reported damage refers to sits among those not
    /// yet claimed in this incident. The MHPCO settles a damage only against
    /// an item this policy actually covers.
    fn insured_item_for(unclaimed: &[&Item], damage: &Damage) -> Result<usize, String> {
        unclaimed
            .iter()
            .position(|item| item.item_type == damage.item_type)
            .ok_or_else(|| format!("{} is not insured", damage.item_type))
    }
}

pub struct PolicyRegister {
    customer: Customer,
    contracts_written: u32,
    policies: Vec<Policy>,
}

impl PolicyRegister {
    pub fn for_customer(customer: Customer) -> Self {
        Self {
            customer,
            contracts_written: 0,
            policies: Vec::new(),
        }
    }

    pub fn quote(&mut self, items: &[Item]) -> u32 {
        let premium = premium_for(&self.customer, items, self.is_follow_up_contract());
        self.contracts_written += 1;
        self.policies.push(Policy {
            items: items.to_vec(),
            remaining_cap: payout_cap(items),
        });
        premium
    }

    pub fn try_quote(&mut self, items: &[Item]) -> Result<u32, String> {
        if let Some(item) = items
            .iter()
            .find(|item| !is_insurable(&item.item_type))
        {
            return Err(format!("{} is not in the MHPCO price list", item.item_type));
        }
        Ok(self.quote(items))
    }

    pub fn quote_policy(&mut self, items: &[Item]) -> usize {
        self.quote(items);
        self.policies.len() - 1
    }

    pub fn claim(&mut self, policy: usize, damages: &[Damage]) -> Result<ClaimResult, String> {
        let policy = self
            .policies
            .get_mut(policy)
            .ok_or_else(|| format!("step {policy} created no policy"))?;
        let reimbursed = policy.total_reimbursement(damages)?;
        Ok(policy.settle(payout_in_mhpco_favor(reimbursed)))
    }

    fn is_follow_up_contract(&self) -> bool {
        self.contracts_written > 0
    }
}

pub fn quote(items: &[Item]) -> u32 {
    quote_for(&Customer::with_years(0), items)
}

pub fn quote_for(customer: &Customer, items: &[Item]) -> u32 {
    premium_for(customer, items, false)
}

fn premium_for(customer: &Customer, items: &[Item], follow_up_contract: bool) -> u32 {
    let policy_base_premium = policy_base_premium(items);
    let risk_surcharges: f64 = items.iter().map(risk_surcharge).sum();
    let premium = policy_base_premium
        + risk_surcharges
        + customer_history_adjustment(customer, policy_base_premium, follow_up_contract)
        + f64::from(PROCESSING_FEE);
    premium_in_mhpco_favor(premium)
}

/// Policy-wide modifiers that depend on the customer's relationship with the
/// MHPCO. They apply to the policy base premium.
fn customer_history_adjustment(
    customer: &Customer,
    policy_base_premium: f64,
    follow_up_contract: bool,
) -> f64 {
    let mut rate = FIRST_INSURANCE_SURCHARGE_RATE;
    if is_long_standing(customer) {
        rate -= LOYALTY_DISCOUNT_RATE;
    }
    if follow_up_contract {
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
    }
    policy_base_premium * rate
}

fn is_long_standing(customer: &Customer) -> bool {
    customer.years_with_mhpco >= LOYALTY_YEARS
}

/// Item-specific risk surcharges apply to the base premium of the affected
/// item, not to the policy total.
fn risk_surcharge(item: &Item) -> f64 {
    let mut rate = 0.0;
    if item.cursed {
        rate += CURSE_SURCHARGE_RATE;
    }
    if is_highly_enchanted(item) {
        rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
    base_premium(item) * rate
}

fn is_highly_enchanted(item: &Item) -> bool {
    item.enchantment >= HIGH_ENCHANTMENT_PREMIUM_LEVEL
}

/// The base premium of a whole policy: main items are priced per item, while
/// alike components are priced in building blocks where the MHPCO offers one.
fn policy_base_premium(items: &[Item]) -> f64 {
    let (components, main_items): (Vec<&Item>, Vec<&Item>) =
        items.iter().partition(|item| is_component(&item.item_type));
    let main_total: f64 = main_items.into_iter().map(base_premium).sum();
    main_total + components_base_premium(&components)
}

fn components_base_premium(components: &[&Item]) -> f64 {
    let mut total = 0.0;
    for item_type in component_types(components) {
        let count = components
            .iter()
            .filter(|item| item.item_type == item_type)
            .count();
        total += alike_components_base_premium(count);
    }
    total
}

fn component_types(components: &[&Item]) -> Vec<String> {
    let mut types: Vec<String> = Vec::new();
    for item in components {
        if !types.contains(&item.item_type) {
            types.push(item.item_type.clone());
        }
    }
    types
}

/// A building block of exactly BLOCK_SIZE alike components is offered at a
/// special base premium; any other count is priced per component.
fn alike_components_base_premium(count: usize) -> f64 {
    if count == BLOCK_SIZE {
        return BLOCK_BASE_PREMIUM;
    }
    count as f64 * COMPONENT_BASE_PREMIUM
}

/// What the MHPCO reimburses for one damage event, after its deductible. A
/// damage within the deductible is reimbursed with nothing; the MHPCO never
/// charges the customer for a claim.
fn reimbursement(damage: &Damage, item: &Item) -> f64 {
    let reimbursable = damage.amount as f64 * reimbursement_rate(item);
    (reimbursable - DEDUCTIBLE).max(0.0)
}

/// The share of a damage the MHPCO reimburses, before its deductible. The
/// high-enchantment clause halves it; the dragon-material clause reimburses in
/// full, which is also what an item under no special clause receives. Where
/// both clauses apply, the high-enchantment clause wins.
fn reimbursement_rate(item: &Item) -> f64 {
    if is_highly_enchanted_for_claims(item) {
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
    }
    FULL_REIMBURSEMENT_RATE
}

fn is_highly_enchanted_for_claims(item: &Item) -> bool {
    item.enchantment >= HIGH_ENCHANTMENT_CLAIM_LEVEL
}

/// The total the MHPCO will pay out on a policy: twice its insurance sum.
fn payout_cap(items: &[Item]) -> u32 {
    insurance_sum(items) * PAYOUT_CAP_MULTIPLE
}

/// The insurance sum of a policy: the sum of its items' insurance values,
/// unaffected by any premium modifier or block discount.
fn insurance_sum(items: &[Item]) -> u32 {
    items.iter().map(insurance_value).sum()
}

fn insurance_value(item: &Item) -> u32 {
    price_list_entry(&item.item_type)
        .map(|entry| entry.insurance_value)
        .unwrap_or_default()
}

/// The MHPCO rounds every amount in its own favor: a premium it charges goes
/// up, a payout it owes goes down.
fn premium_in_mhpco_favor(premium: f64) -> u32 {
    premium.ceil() as u32
}

fn payout_in_mhpco_favor(payout: f64) -> u32 {
    payout.floor() as u32
}

/// Base premium per component, uniform across every component type.
const COMPONENT_BASE_PREMIUM: f64 = 25.0;

/// Insurance value per component, uniform across every component type.
const COMPONENT_INSURANCE_VALUE: u32 = 250;

const BLOCK_SIZE: usize = 3;
const BLOCK_BASE_PREMIUM: f64 = 60.0;

fn base_premium(item: &Item) -> f64 {
    price_list_entry(&item.item_type)
        .map(|entry| entry.base_premium)
        .unwrap_or_default()
}

fn is_component(item_type: &str) -> bool {
    matches!(item_type, "rune" | "moonstone")
}

/// Whether the MHPCO price list covers an item type at all. The MHPCO insures
/// only the magical items its price list names.
fn is_insurable(item_type: &str) -> bool {
    price_list_entry(item_type).is_some()
}

/// One row of the MHPCO price list: the insurance value and base premium for
/// an item type, or nothing if the MHPCO does not insure that type.
/// Components share a single uniform row.
fn price_list_entry(item_type: &str) -> Option<PriceListEntry> {
    if is_component(item_type) {
        return Some(PriceListEntry {
            insurance_value: COMPONENT_INSURANCE_VALUE,
            base_premium: COMPONENT_BASE_PREMIUM,
        });
    }
    let (insurance_value, base_premium) = match item_type {
        "sword" => (1000, 100.0),
        "amulet" => (600, 60.0),
        "staff" => (800, 80.0),
        "potion" => (400, 40.0),
        _ => return None,
    };
    Some(PriceListEntry {
        insurance_value,
        base_premium,
    })
}

struct PriceListEntry {
    insurance_value: u32,
    base_premium: f64,
}

#[cfg(test)]
mod tests {
    use super::*;

    // ---- Premium: simplest cases -------------------------------------

    #[test]
    fn empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(quote(&[]), 5);
    }

    #[test]
    fn plain_sword_premium() {
        assert_eq!(quote(&[Item::of_type("sword")]), 115);
    }

    #[test]
    fn plain_amulet_premium() {
        assert_eq!(quote(&[Item::of_type("amulet")]), 71);
    }

    #[test]
    fn plain_staff_premium() {
        assert_eq!(quote(&[Item::of_type("staff")]), 93);
    }

    #[test]
    fn plain_potion_premium() {
        assert_eq!(quote(&[Item::of_type("potion")]), 49);
    }

    #[test]
    fn single_rune_base_premium() {
        // base 25 G + 10% first insurance (2.5) + 5 G fee = 32.5 -> 33 G
        assert_eq!(quote(&[Item::of_type("rune")]), 33);
    }

    #[test]
    fn single_moonstone_base_premium() {
        assert_eq!(quote(&[Item::of_type("moonstone")]), 33);
    }

    // ---- Component building blocks -----------------------------------

    #[test]
    fn two_runes_have_no_block_discount() {
        // base 50 G + 5 G first insurance + 5 G fee = 60 G
        assert_eq!(quote(&[Item::of_type("rune"), Item::of_type("rune")]), 60);
    }

    #[test]
    fn three_runes_form_a_block() {
        // block base 60 G + 6 G first insurance + 5 G fee = 71 G
        let runes = [
            Item::of_type("rune"),
            Item::of_type("rune"),
            Item::of_type("rune"),
        ];
        assert_eq!(quote(&runes), 71);
    }

    #[test]
    fn four_runes_have_no_block_discount() {
        // base 100 G + 10 G first insurance + 5 G fee = 115 G
        let runes = [
            Item::of_type("rune"),
            Item::of_type("rune"),
            Item::of_type("rune"),
            Item::of_type("rune"),
        ];
        assert_eq!(quote(&runes), 115);
    }

    #[test]
    fn seven_runes_have_no_block_discount() {
        // base 175 G + 17.5 G first insurance + 5 G fee = 197.5 -> 198 G
        let runes: Vec<Item> = (0..7).map(|_| Item::of_type("rune")).collect();
        assert_eq!(quote(&runes), 198);
    }

    #[test]
    fn three_moonstones_form_a_block() {
        let stones: Vec<Item> = (0..3).map(|_| Item::of_type("moonstone")).collect();
        assert_eq!(quote(&stones), 71);
    }

    #[test]
    fn alike_means_same_component_type() {
        // base 75 G + 7.5 G first insurance + 5 G fee = 87.5 -> 88 G
        let items = [
            Item::of_type("rune"),
            Item::of_type("rune"),
            Item::of_type("moonstone"),
        ];
        assert_eq!(quote(&items), 88);
    }

    #[test]
    fn two_separate_blocks_each_get_the_block_premium() {
        // base 120 G + 12 G first insurance + 5 G fee = 137 G
        let mut items: Vec<Item> = (0..3).map(|_| Item::of_type("rune")).collect();
        items.extend((0..3).map(|_| Item::of_type("moonstone")));
        assert_eq!(quote(&items), 137);
    }

    // ---- Item-specific modifiers -------------------------------------

    #[test]
    fn cursed_item_adds_fifty_percent_of_its_base_premium() {
        // base 100 G + 50 G curse + 10 G first insurance + 5 G fee = 165 G
        assert_eq!(quote(&[Item::of_type("sword").cursed()]), 165);
    }

    #[test]
    fn enchantment_exactly_five_adds_the_high_enchantment_surcharge() {
        // base 100 G + 30 G high enchantment + 10 G first insurance + 5 G fee = 145 G
        assert_eq!(quote(&[Item::of_type("sword").enchantment(5)]), 145);
    }

    #[test]
    fn enchantment_four_adds_no_high_enchantment_surcharge() {
        assert_eq!(quote(&[Item::of_type("sword").enchantment(4)]), 115);
    }

    #[test]
    fn curse_and_high_enchantment_both_apply() {
        // base 100 + 50 curse + 30 high enchantment + 10 first insurance + 5 fee = 195 G
        assert_eq!(quote(&[Item::of_type("sword").enchantment(5).cursed()]), 195);
    }

    #[test]
    fn enchantment_four_cursed_applies_only_the_curse_surcharge() {
        assert_eq!(quote(&[Item::of_type("sword").enchantment(4).cursed()]), 165);
    }

    // ---- Modifier scope on multi-item policies -----------------------

    #[test]
    fn item_modifiers_apply_to_the_affected_items_base_premium_only() {
        // policy base 160 G + 50 G curse (50% of the sword only) = 210 G
        // + 16 G first insurance + 5 G fee = 231 G
        let items = [
            Item::of_type("sword").cursed(),
            Item::of_type("amulet"),
        ];
        assert_eq!(quote(&items), 231);
    }

    // ---- Policy-wide modifiers ---------------------------------------

    #[test]
    fn loyalty_discount_applies_at_exactly_two_years() {
        // base 100 - 20 loyalty + 10 first insurance + 5 fee = 95 G
        let customer = Customer::with_years(2);
        assert_eq!(
            quote_for(&customer, &[Item::of_type("sword")]),
            95
        );
    }

    #[test]
    fn loyalty_discount_does_not_apply_below_two_years() {
        let customer = Customer::with_years(1);
        assert_eq!(quote_for(&customer, &[Item::of_type("sword")]), 115);
    }

    #[test]
    fn first_insurance_surcharge_applies_to_a_quote() {
        // base 80 + 8 initial assessment + 5 fee = 93 G (85 G without the surcharge)
        let customer = Customer::with_years(0);
        assert_eq!(quote_for(&customer, &[Item::of_type("staff")]), 93);
    }

    #[test]
    fn follow_up_contract_discount_applies_from_the_second_quote() {
        // second contract: base 80 + 8 first insurance - 12 follow-up + 5 fee = 81 G
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        policies.quote(&[Item::of_type("staff")]);
        assert_eq!(policies.quote(&[Item::of_type("staff")]), 81);
    }

    #[test]
    fn first_insurance_surcharge_applies_even_on_a_follow_up_contract() {
        // 3-year customer's second contract, cursed sword enchantment 7:
        // 100 base + 50 curse + 30 high enchantment - 20 loyalty
        // + 10 first insurance - 15 follow-up = 155 + 5 fee = 160 G
        let mut policies = PolicyRegister::for_customer(Customer::with_years(3));
        policies.quote(&[Item::of_type("potion")]);
        let premium = policies.quote(&[Item::of_type("sword").enchantment(7).cursed()]);
        assert_eq!(premium, 160);
    }

    #[test]
    fn policy_wide_modifiers_use_the_policy_base_premium() {
        // policy base 160 G; net policy-wide rate 10% - 20% = -10% -> -16 G; + 5 fee
        let customer = Customer::with_years(2);
        let items = [Item::of_type("sword"), Item::of_type("amulet")];
        assert_eq!(quote_for(&customer, &items), 149);
    }

    // ---- Rounding -----------------------------------------------------

    #[test]
    fn premium_is_rounded_up() {
        // 7 runes: 175 + 17.5 + 5 = 197.5 -> 198 G, not 197 G
        let runes: Vec<Item> = (0..7).map(|_| Item::of_type("rune")).collect();
        assert_eq!(quote(&runes), 198);
        // a single rune: 25 + 2.5 + 5 = 32.5 -> 33 G, not 32 G
        assert_eq!(quote(&[Item::of_type("rune")]), 33);
    }

    #[test]
    fn only_the_final_premium_is_rounded() {
        // cursed rune, 2-year customer: base 25, curse +12.5, policy-wide -2.5,
        // fee +5 -> 40.0 exactly. Rounding either fraction on its own in the
        // MHPCO's favor would yield 41 G.
        let customer = Customer::with_years(2);
        assert_eq!(quote_for(&customer, &[Item::of_type("rune").cursed()]), 40);
    }

    // ---- Premium integration examples --------------------------------

    #[test]
    fn newcomer_with_a_cursed_sword_pays_165() {
        // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165 G
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("steel").enchantment(3).cursed();
        assert_eq!(policies.quote(&[sword]), 165);
    }

    #[test]
    fn long_standing_customers_second_contract_pays_160() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(3));
        policies.quote(&[Item::of_type("staff")]);
        let sword = Item::of_type("sword").material("steel").enchantment(7).cursed();
        assert_eq!(policies.quote(&[sword]), 160);
    }

    // ---- Insurance sum and cap ---------------------------------------

    #[test]
    fn cap_is_twice_the_sum_of_item_insurance_values() {
        // insurance sum 1000 + 600 = 1600 G, cap 3200 G; a 100 G damage pays
        // nothing after the deductible, so the whole cap remains
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword"), Item::of_type("amulet")]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 100)])
            .expect("the sword is insured");
        assert_eq!(result.remaining_cap, 3200);
    }

    #[test]
    fn two_items_of_the_same_type_both_count_toward_the_insurance_sum() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword"), Item::of_type("sword")]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 100)])
            .expect("the sword is insured");
        assert_eq!(result.remaining_cap, 4000);
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").cursed();
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 100)])
            .expect("the sword is insured");
        assert_eq!(result.remaining_cap, 2000);
    }

    #[test]
    fn block_discount_affects_the_premium_not_the_insurance_sum() {
        // insurance sum 1000 + 3x250 = 1750 G -> cap 3500 G, despite the block
        // discount on the premium
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let mut items = vec![Item::of_type("sword")];
        items.extend((0..3).map(|_| Item::of_type("rune")));
        let policy = policies.quote_policy(&items);
        let result = policies
            .claim(policy, &[Damage::to("sword", 100)])
            .expect("the sword is insured");
        assert_eq!(result.remaining_cap, 3500);
    }

    // ---- Claim: standard reimbursement -------------------------------

    #[test]
    fn standard_reimbursement_subtracts_the_deductible() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("steel").enchantment(3);
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 500)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn component_damage_has_no_special_clause() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("rune")]);
        let result = policies
            .claim(policy, &[Damage::to("rune", 200)])
            .expect("the rune is insured");
        assert_eq!(result.payout, 100);
    }

    #[test]
    fn payout_is_never_negative() {
        // The spec does not state this case; adopted reading: a damage at or
        // below the deductible pays nothing, since the MHPCO never charges the
        // customer for a claim.
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword")]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 50)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 0);
    }

    // ---- Claim: special clauses --------------------------------------

    #[test]
    fn high_enchantment_damage_is_reimbursed_at_fifty_percent() {
        // 50% of 1000 = 500, then the deductible: 500 - 100 = 400 G
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("steel").enchantment(9);
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 1000)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn high_enchantment_clause_applies_at_exactly_eight() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("steel").enchantment(8);
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 1000)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn enchantment_seven_gets_full_reimbursement() {
        // enchantment 7 is highly enchanted for the premium (level 5) but not
        // for the claim clause (level 8): full reimbursement, then deductible
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("steel").enchantment(7);
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 1000)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 900);
    }

    #[test]
    fn dragon_material_damage_is_fully_reimbursed() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("dragon").enchantment(5);
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 800)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 700);
    }

    #[test]
    fn high_enchantment_wins_over_dragon_material_at_eight() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("dragon").enchantment(8);
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 1000)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn high_enchantment_wins_over_dragon_material_at_nine() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("dragon").enchantment(9);
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 1000)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 400);
    }

    // ---- Claim: multiple damages -------------------------------------

    #[test]
    fn the_deductible_applies_once_per_damage_entry() {
        // (500 - 100) + (300 - 100) = 600 G
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword"), Item::of_type("amulet")]);
        let result = policies
            .claim(
                policy,
                &[Damage::to("sword", 500), Damage::to("amulet", 300)],
            )
            .expect("both items are insured");
        assert_eq!(result.payout, 600);
    }

    #[test]
    fn repeated_item_types_are_separate_damages() {
        // (500 - 100) + (400 - 100) = 700 G
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword"), Item::of_type("sword")]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 500), Damage::to("sword", 400)])
            .expect("both swords are insured");
        assert_eq!(result.payout, 700);
    }

    // ---- Claim: cap exhaustion ---------------------------------------

    #[test]
    fn first_claim_reduces_the_remaining_cap() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword")]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 1500)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 1400);
        assert_eq!(result.remaining_cap, 600);
    }

    #[test]
    fn a_claim_is_capped_at_the_remaining_cap() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword")]);
        let first = policies
            .claim(policy, &[Damage::to("sword", 1500)])
            .expect("the sword is insured");
        assert_eq!((first.payout, first.remaining_cap), (1400, 600));
        // the desired 1400 G is reduced to the remaining cap
        let second = policies
            .claim(policy, &[Damage::to("sword", 1500)])
            .expect("the sword is insured");
        assert_eq!((second.payout, second.remaining_cap), (600, 0));
    }

    #[test]
    fn payout_is_rounded_down() {
        // 50% of 901 = 450.5, minus the deductible = 350.5 -> 350 G, not 351 G
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let sword = Item::of_type("sword").material("steel").enchantment(8);
        let policy = policies.quote_policy(&[sword]);
        let result = policies
            .claim(policy, &[Damage::to("sword", 901)])
            .expect("the sword is insured");
        assert_eq!(result.payout, 350);
    }

    // ---- Error cases --------------------------------------------------

    #[test]
    fn quote_with_an_unknown_item_type_is_rejected() {
        // Observable contract: an error result, which the CLI reports on
        // stderr with a non-zero exit status and no results on stdout.
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let error = policies
            .try_quote(&[Item::of_type("broomstick")])
            .expect_err("a broomstick is not in the MHPCO price list");
        assert!(error.contains("broomstick"), "error was: {error}");
    }

    #[test]
    fn claim_for_an_uninsured_item_is_rejected() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword")]);
        let error = policies
            .claim(policy, &[Damage::to("amulet", 300)])
            .expect_err("only the sword is insured");
        assert!(error.contains("amulet"), "error was: {error}");
    }

    #[test]
    fn claim_with_an_unknown_item_type_is_rejected() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword")]);
        let error = policies
            .claim(policy, &[Damage::to("broomstick", 300)])
            .expect_err("a broomstick is not insured");
        assert!(error.contains("broomstick"), "error was: {error}");
    }

    #[test]
    fn claim_with_more_damages_than_insured_items_is_rejected() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword")]);
        let error = policies
            .claim(policy, &[Damage::to("sword", 500), Damage::to("sword", 400)])
            .expect_err("only one sword is insured");
        assert!(error.contains("sword"), "error was: {error}");
    }

    #[test]
    fn claim_with_a_negative_damage_amount_is_rejected() {
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        let policy = policies.quote_policy(&[Item::of_type("sword")]);
        let error = policies
            .claim(policy, &[Damage::to("sword", -200)])
            .expect_err("a damage cannot be negative");
        assert!(error.contains("-200"), "error was: {error}");
    }

    #[test]
    fn claim_referencing_a_non_quote_policy_index_is_rejected() {
        // The spec defines `policy` as the index of the quote step that
        // created the policy. Adopted reading: an index naming no policy is
        // rejected like any other claim error, not a crash.
        let mut policies = PolicyRegister::for_customer(Customer::with_years(0));
        policies.quote_policy(&[Item::of_type("sword")]);
        let error = policies
            .claim(7, &[Damage::to("sword", 500)])
            .expect_err("step 7 created no policy");
        assert!(error.contains('7'), "error was: {error}");
    }

    // ---- Scenario / CLI contract -------------------------------------

    #[test]
    fn scenario_results_mirror_the_steps() {
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "quote", "items": [{"type": "amulet"}]}
            ]
        }"#;
        let output = run_scenario(scenario).expect("the scenario is valid");
        assert_eq!(
            output,
            r#"{"results":[{"premium":115},{"premium":62}]}"#
        );
    }

    #[test]
    fn schema_example_scenario_round_trip() {
        // premium: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59 G
        // payout: 200 - 100 deductible = 100 G; cap 1200 - 100 = 1100 G
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 5},
            "steps": [
                {
                    "op": "quote",
                    "items": [
                        {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
                    ]
                },
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {
                        "cause": "fire",
                        "damages": [{"itemType": "amulet", "amount": 200}]
                    }
                }
            ]
        }"#;
        let output = run_scenario(scenario).expect("the scenario is valid");
        assert_eq!(
            output,
            r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
        );
    }

    #[test]
    fn a_claim_uses_the_policy_from_the_referenced_quote_step() {
        // step 0 insures a potion (sum 400, cap 800); step 1 insures a sword
        // (sum 1000, cap 2000). The claim names step 0, so the 300 G damage
        // draws on the potion's cap: payout 200, remaining 600.
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "potion"}]},
                {"op": "quote", "items": [{"type": "sword"}]},
                {
                    "op": "claim",
                    "policy": 0,
                    "incident": {"cause": "spill", "damages": [{"itemType": "potion", "amount": 300}]}
                }
            ]
        }"#;
        let output = run_scenario(scenario).expect("the scenario is valid");
        assert!(
            output.ends_with(r#"{"payout":200,"remainingCap":600}]}"#),
            "output was: {output}"
        );
    }
}
