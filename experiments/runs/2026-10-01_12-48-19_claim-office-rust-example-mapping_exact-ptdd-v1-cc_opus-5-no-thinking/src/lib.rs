mod scenario;

pub use scenario::run_scenario;

/// A damage entry in an incident report.
pub struct Damage {
    pub item_type: ItemType,
    pub amount: i64,
}

/// What the office pays out for one incident.
pub struct Settlement {
    pub payout: i64,
    pub remaining_cap: i64,
}

/// An issued policy, which settles incidents against the items it covers.
pub struct Policy {
    covered: Vec<Item>,
    remaining_cap: i64,
}

impl Policy {
    pub fn covering(items: &[Item]) -> Self {
        let covered = items.to_vec();
        let remaining_cap = insurance_sum(&covered) * CAP_MULTIPLE;
        Self { covered, remaining_cap }
    }

    /// The sum of the insurance values of the items the policy covers.
    pub fn insurance_sum(&self) -> i64 {
        insurance_sum(&self.covered)
    }

    /// The cap remaining on this policy.
    pub fn remaining_cap(&self) -> i64 {
        self.remaining_cap
    }

    /// The covered items the damage entries refer to. Each covered item
    /// answers for at most one entry, so a claim naming more items of a type
    /// than the policy covers is refused in full.
    fn damaged_items(&self, damages: &[Damage]) -> Result<Vec<&Item>, MhpcoError> {
        let mut unclaimed: Vec<&Item> = self.covered.iter().collect();
        let mut damaged = Vec::with_capacity(damages.len());
        for damage in damages {
            let covering = unclaimed
                .iter()
                .position(|item| item.item_type == damage.item_type);
            match covering {
                Some(position) => damaged.push(unclaimed.remove(position)),
                None => return Err(not_covered(damage.item_type)),
            }
        }
        Ok(damaged)
    }

    /// The office pays at most what the policy's cap still allows, and the
    /// amount paid consumes that much of the cap.
    fn pay_within_cap(&mut self, desired: i64) -> i64 {
        let paid = desired.min(self.remaining_cap);
        self.remaining_cap -= paid;
        paid
    }

    pub fn settle(&mut self, damages: &[Damage]) -> Result<Settlement, MhpcoError> {
        check_reportable(damages)?;
        let damaged = self.damaged_items(damages)?;
        let mut payout_in_hundredths = 0;
        for (item, damage) in damaged.iter().zip(damages) {
            payout_in_hundredths +=
                reimbursement_in_hundredths(item, damage.amount) - DEDUCTIBLE * HUNDREDTHS;
        }
        let desired = round_down_to_whole_g(payout_in_hundredths);
        let payout = self.pay_within_cap(desired);
        Ok(Settlement { payout, remaining_cap: self.remaining_cap })
    }
}

fn insurance_sum(items: &[Item]) -> i64 {
    items.iter().map(insurance_value).sum()
}

/// The MHPCO price list: the insurance value in G of one item.
fn insurance_value(item: &Item) -> i64 {
    match item.item_type {
        ItemType::Sword => 1000,
        ItemType::Amulet => 600,
        ItemType::Staff => 800,
        ItemType::Potion => 400,
        ItemType::Rune | ItemType::Moonstone => COMPONENT_INSURANCE_VALUE,
    }
}

/// How much of a damage the office reimburses before the deductible.
fn reimbursement_in_hundredths(item: &Item, amount: i64) -> i64 {
    if item.enchantment >= HIGH_ENCHANTMENT_CLAUSE {
        amount * HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT
    } else {
        amount * HUNDREDTHS
    }
}

/// The office only entertains a damage report of a real loss.
fn check_reportable(damages: &[Damage]) -> Result<(), MhpcoError> {
    match damages.iter().find(|damage| damage.amount < 0) {
        Some(damage) => Err(MhpcoError(format!(
            "a damage cannot be reported as {} G",
            damage.amount
        ))),
        None => Ok(()),
    }
}

fn not_covered(item_type: ItemType) -> MhpcoError {
    MhpcoError(format!("the policy does not cover the damaged {item_type:?}"))
}

/// A refusal by the claims office, with the description it reports.
#[derive(Debug, PartialEq, Eq)]
pub struct MhpcoError(pub String);

impl std::fmt::Display for MhpcoError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        self.0.fmt(f)
    }
}

/// Damage to items with enchantment level >= 8 is reimbursed at 50 %.
const HIGH_ENCHANTMENT_CLAUSE: i64 = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT: i64 = 50;

/// Components share one published insurance value.
const COMPONENT_INSURANCE_VALUE: i64 = 250;

/// The total payout per policy is capped at twice the insurance sum.
const CAP_MULTIPLE: i64 = 2;

/// A deductible applies per damage event.
const DEDUCTIBLE: i64 = 100;

const PROCESSING_FEE: i64 = 5;

/// Intermediate amounts are kept as hundredths of G so no rounding happens
/// before the final premium or payout. A percentage rate is therefore already
/// expressed in hundredths of the amount it applies to.
const HUNDREDTHS: i64 = 100;

/// Components -- runes, moonstones -- share one published base premium.
const COMPONENT_BASE_PREMIUM: i64 = 25;

/// A building block of alike components, and its special base premium.
const BLOCK_SIZE: i64 = 3;
const BLOCK_BASE_PREMIUM: i64 = 60;

const CURSE_SURCHARGE_PERCENT: i64 = 50;

const HIGH_ENCHANTMENT: i64 = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT: i64 = 30;

const FIRST_INSURANCE_SURCHARGE_PERCENT: i64 = 10;

const FOLLOW_UP_DISCOUNT_PERCENT: i64 = 15;

const LOYALTY_YEARS: i64 = 2;
const LOYALTY_DISCOUNT_PERCENT: i64 = 20;

const COMPONENT_TYPES: [ItemType; 2] = [ItemType::Rune, ItemType::Moonstone];

#[derive(Clone, Copy, PartialEq, Eq, Default, Debug)]
pub enum ItemType {
    #[default]
    Sword,
    Amulet,
    Staff,
    Potion,
    Rune,
    Moonstone,
}

/// What an item is made of; dragon material is reimbursed in full.
#[derive(Clone, Copy, PartialEq, Eq, Default, Debug)]
pub enum Material {
    #[default]
    Ordinary,
    Dragon,
}

impl Material {
    /// Anything the scenario document does not name as dragon is ordinary.
    pub fn from_name(name: Option<&str>) -> Self {
        match name {
            Some("dragon") => Self::Dragon,
            _ => Self::Ordinary,
        }
    }
}

#[derive(Default, Clone)]
pub struct Item {
    pub item_type: ItemType,
    pub material: Material,
    pub cursed: bool,
    pub enchantment: i64,
}

#[derive(Default)]
pub struct Customer {
    pub years_with_mhpco: i64,
    /// Contracts the customer already holds; each later contract is discounted.
    pub contracts_so_far: i64,
}

pub fn quote(customer: &Customer, items: &[Item]) -> i64 {
    let policy_base = policy_base_premium(items);
    let premium_in_hundredths = (policy_base + PROCESSING_FEE) * HUNDREDTHS
        + item_surcharge_total_in_hundredths(items)
        + policy_modifiers_in_hundredths(customer, policy_base);
    round_up_to_whole_g(premium_in_hundredths)
}

/// Amounts are rounded to whole G in the MHPCO's favor: a premium up.
fn round_up_to_whole_g(amount_in_hundredths: i64) -> i64 {
    (amount_in_hundredths + HUNDREDTHS - 1) / HUNDREDTHS
}

/// ... and a payout down.
fn round_down_to_whole_g(amount_in_hundredths: i64) -> i64 {
    amount_in_hundredths / HUNDREDTHS
}

/// The policy base premium: the sum of all item base premiums. Policy-wide
/// modifiers are measured against this figure, item surcharges are not.
pub fn policy_base_premium(items: &[Item]) -> i64 {
    main_items_base_premium(items) + components_base_premium(items)
}

/// Item-specific surcharges attach to their own item's base premium.
pub fn item_surcharge_total(items: &[Item]) -> i64 {
    item_surcharge_total_in_hundredths(items) / HUNDREDTHS
}

fn item_surcharge_total_in_hundredths(items: &[Item]) -> i64 {
    items.iter().map(item_surcharges).sum()
}

/// Policy-wide modifiers apply to the policy base premium, the sum of all
/// item base premiums.
fn policy_modifiers_in_hundredths(customer: &Customer, policy_base: i64) -> i64 {
    let mut modifiers = 0;
    if customer.years_with_mhpco >= LOYALTY_YEARS {
        modifiers -= policy_base * LOYALTY_DISCOUNT_PERCENT;
    }
    modifiers += policy_base * FIRST_INSURANCE_SURCHARGE_PERCENT;
    if customer.contracts_so_far > 0 {
        modifiers -= policy_base * FOLLOW_UP_DISCOUNT_PERCENT;
    }
    modifiers
}

/// Main items -- swords, amulets, staves, potions -- are priced one at a time.
fn main_items_base_premium(items: &[Item]) -> i64 {
    let mut total = 0;
    for item in items {
        if !item.item_type.is_component() {
            total += base_premium(item);
        }
    }
    total
}

/// Item-specific risk surcharges apply to the affected item's base premium.
fn item_surcharges(item: &Item) -> i64 {
    let mut surcharges = 0;
    if item.cursed {
        surcharges += base_premium(item) * CURSE_SURCHARGE_PERCENT;
    }
    if item.enchantment >= HIGH_ENCHANTMENT {
        surcharges += base_premium(item) * HIGH_ENCHANTMENT_SURCHARGE_PERCENT;
    }
    surcharges
}

/// Alike components are offered as a block of 3 at a special base premium.
fn components_base_premium(items: &[Item]) -> i64 {
    let mut total = 0;
    for component_type in COMPONENT_TYPES {
        let count = items
            .iter()
            .filter(|item| item.item_type == component_type)
            .count() as i64;
        total += if count == BLOCK_SIZE {
            BLOCK_BASE_PREMIUM
        } else {
            count * COMPONENT_BASE_PREMIUM
        };
    }
    total
}

impl ItemType {
    /// Translate a name from the scenario document into an insurable type.
    pub fn from_name(name: &str) -> Result<Self, MhpcoError> {
        match name {
            "sword" => Ok(Self::Sword),
            "amulet" => Ok(Self::Amulet),
            "staff" => Ok(Self::Staff),
            "potion" => Ok(Self::Potion),
            "rune" => Ok(Self::Rune),
            "moonstone" => Ok(Self::Moonstone),
            _ => Err(MhpcoError(format!("the MHPCO does not insure a {name}"))),
        }
    }

    fn is_component(self) -> bool {
        COMPONENT_TYPES.contains(&self)
    }
}

/// The MHPCO price list: the base premium in G charged for one item.
fn base_premium(item: &Item) -> i64 {
    match item.item_type {
        ItemType::Sword => 100,
        ItemType::Amulet => 60,
        ItemType::Staff => 80,
        ItemType::Potion => 40,
        ItemType::Rune | ItemType::Moonstone => COMPONENT_BASE_PREMIUM,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_item_list_costs_only_the_processing_fee() {
        assert_eq!(quote(&newcomer(), &[]), 5);
    }

    #[test]
    fn sword_has_base_premium_100() {
        assert_eq!(policy_base_premium(&[Item { item_type: ItemType::Sword, ..Default::default() }]), 100);
    }

    #[test]
    fn amulet_has_base_premium_60() {
        assert_eq!(policy_base_premium(&[Item { item_type: ItemType::Amulet, ..Default::default() }]), 60);
    }

    #[test]
    fn staff_has_base_premium_80() {
        assert_eq!(policy_base_premium(&[Item { item_type: ItemType::Staff, ..Default::default() }]), 80);
    }

    #[test]
    fn potion_has_base_premium_40() {
        assert_eq!(policy_base_premium(&[Item { item_type: ItemType::Potion, ..Default::default() }]), 40);
    }

    #[test]
    fn rune_component_has_base_premium_25() {
        assert_eq!(policy_base_premium(&[Item { item_type: ItemType::Rune, ..Default::default() }]), 25);
    }

    #[test]
    fn moonstone_component_has_base_premium_25() {
        assert_eq!(policy_base_premium(&[Item { item_type: ItemType::Moonstone, ..Default::default() }]), 25);
    }

    #[test]
    fn two_runes_cost_50() {
        let two_runes = [
            Item { item_type: ItemType::Rune, ..Default::default() },
            Item { item_type: ItemType::Rune, ..Default::default() },
        ];
        assert_eq!(policy_base_premium(&two_runes), 50);
    }

    #[test]
    fn three_alike_runes_form_a_block_at_60() {
        let three_runes = [
            Item { item_type: ItemType::Rune, ..Default::default() },
            Item { item_type: ItemType::Rune, ..Default::default() },
            Item { item_type: ItemType::Rune, ..Default::default() },
        ];
        assert_eq!(policy_base_premium(&three_runes), 60);
    }

    #[test]
    fn four_runes_cost_100_because_a_block_requires_exactly_three() {
        let four_runes = [
            Item { item_type: ItemType::Rune, ..Default::default() },
            Item { item_type: ItemType::Rune, ..Default::default() },
            Item { item_type: ItemType::Rune, ..Default::default() },
            Item { item_type: ItemType::Rune, ..Default::default() },
        ];
        assert_eq!(policy_base_premium(&four_runes), 100);
    }

    #[test]
    fn seven_runes_cost_175() {
        let seven_runes: Vec<Item> = (0..7)
            .map(|_| Item { item_type: ItemType::Rune, ..Default::default() })
            .collect();
        assert_eq!(policy_base_premium(&seven_runes), 175);
    }

    #[test]
    fn alike_means_the_same_component_type() {
        let mixed = [
            Item { item_type: ItemType::Rune, ..Default::default() },
            Item { item_type: ItemType::Rune, ..Default::default() },
            Item { item_type: ItemType::Moonstone, ..Default::default() },
        ];
        assert_eq!(policy_base_premium(&mixed), 75);
    }

    #[test]
    fn two_separate_alike_blocks_each_cost_60() {
        let mut two_blocks: Vec<Item> = (0..3)
            .map(|_| Item { item_type: ItemType::Rune, ..Default::default() })
            .collect();
        two_blocks.extend((0..3).map(|_| Item { item_type: ItemType::Moonstone, ..Default::default() }));
        assert_eq!(policy_base_premium(&two_blocks), 120);
    }

    #[test]
    fn cursed_item_adds_a_fifty_percent_risk_surcharge() {
        let cursed_sword = Item {
            item_type: ItemType::Sword,
            cursed: true,
            ..sword()
        };
        assert_eq!(item_surcharge_total(&[cursed_sword]), 50);
    }

    fn newcomer() -> Customer {
        Customer { years_with_mhpco: 0, ..Default::default() }
    }

    fn sword() -> Item {
        Item {
            item_type: ItemType::Sword,
            ..Default::default()
        }
    }

    #[test]
    fn enchantment_of_exactly_five_adds_a_thirty_percent_surcharge() {
        let enchanted_sword = Item { enchantment: 5, ..sword() };
        assert_eq!(item_surcharge_total(&[enchanted_sword]), 30);
    }

    #[test]
    fn enchantment_of_four_adds_no_surcharge() {
        let sword = Item { enchantment: 4, ..sword() };
        assert_eq!(item_surcharge_total(&[sword]), 0);
    }

    #[test]
    fn curse_and_high_enchantment_surcharges_both_apply() {
        let sword = Item { cursed: true, enchantment: 5, ..sword() };
        assert_eq!(item_surcharge_total(&[sword]), 80);
    }

    #[test]
    fn exactly_two_years_with_mhpco_earns_the_loyalty_discount() {
        let loyal = Customer { years_with_mhpco: 2, ..Default::default() };
        assert_eq!(quote(&loyal, &[sword()]), 95);
    }

    #[test]
    fn one_year_with_mhpco_earns_no_loyalty_discount() {
        let newish = Customer { years_with_mhpco: 1, ..Default::default() };
        assert_eq!(quote(&newish, &[sword()]), 115);
    }

    #[test]
    fn first_insurance_adds_an_initial_assessment_surcharge() {
        assert_eq!(quote(&newcomer(), &[sword()]), 115);
    }

    #[test]
    fn each_contract_after_the_first_earns_a_follow_up_discount() {
        let returning = Customer { contracts_so_far: 1, ..newcomer() };
        // 100 base - 15 follow-up + 10 first insurance + 5 fee
        assert_eq!(quote(&returning, &[sword()]), 100);
    }

    #[test]
    fn first_insurance_surcharge_applies_to_every_quote_regardless_of_history() {
        let loyal_returning = Customer { years_with_mhpco: 3, contracts_so_far: 1 };
        // 100 base - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee
        assert_eq!(quote(&loyal_returning, &[sword()]), 80);
    }

    #[test]
    fn item_modifiers_apply_only_to_the_affected_items_base_premium() {
        let policy = [
            Item { cursed: true, ..sword() },
            Item { item_type: ItemType::Amulet, ..Default::default() },
        ];
        assert_eq!(policy_base_premium(&policy), 160);
        // 50 % of the cursed sword's base premium, not of the policy total
        assert_eq!(item_surcharge_total(&policy), 50);
    }

    #[test]
    fn a_fractional_premium_is_rounded_up() {
        // 25 base + 2.5 first insurance + 5 fee = 32.5 -> 33
        let one_rune = [Item { item_type: ItemType::Rune, ..Default::default() }];
        assert_eq!(quote(&newcomer(), &one_rune), 33);
    }

    #[test]
    fn newcomer_with_a_cursed_sword_pays_165() {
        let cursed_sword = Item { cursed: true, enchantment: 3, ..sword() };
        assert_eq!(quote(&newcomer(), &[cursed_sword]), 165);
    }

    #[test]
    fn long_standing_customers_second_contract_costs_160() {
        let customer = Customer { years_with_mhpco: 3, contracts_so_far: 1 };
        let cursed_sword = Item { cursed: true, enchantment: 7, ..sword() };
        assert_eq!(quote(&customer, &[cursed_sword]), 160);
    }

    #[test]
    fn a_quote_with_an_unknown_item_type_is_rejected() {
        assert_eq!(ItemType::from_name("sword"), Ok(ItemType::Sword));
        assert!(ItemType::from_name("broomstick").is_err());
    }

    #[test]
    fn standard_damage_is_reimbursed_in_full_minus_the_deductible() {
        let mut policy = Policy::covering(&[Item { enchantment: 3, ..sword() }]);
        let settlement = policy
            .settle(&[Damage { item_type: ItemType::Sword, amount: 500 }])
            .unwrap();
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn a_component_damage_has_no_special_clause() {
        let rune = Item { item_type: ItemType::Rune, ..Default::default() };
        let mut policy = Policy::covering(&[rune]);
        let settlement = policy
            .settle(&[Damage { item_type: ItemType::Rune, amount: 200 }])
            .unwrap();
        assert_eq!(settlement.payout, 100);
    }

    #[test]
    fn enchantment_of_eight_or_more_is_reimbursed_at_fifty_percent() {
        let mut policy = Policy::covering(&[Item { enchantment: 9, ..sword() }]);
        let settlement = policy
            .settle(&[Damage { item_type: ItemType::Sword, amount: 1000 }])
            .unwrap();
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn dragon_material_damage_is_fully_reimbursed() {
        let dragon_sword = Item {
            material: Material::Dragon,
            enchantment: 5,
            ..sword()
        };
        let mut policy = Policy::covering(&[dragon_sword]);
        let settlement = policy
            .settle(&[Damage { item_type: ItemType::Sword, amount: 800 }])
            .unwrap();
        assert_eq!(settlement.payout, 700);
    }

    #[test]
    fn at_enchantment_eight_the_fifty_percent_rule_beats_dragon_material() {
        let dragon_sword = Item {
            material: Material::Dragon,
            enchantment: 8,
            ..sword()
        };
        let mut policy = Policy::covering(&[dragon_sword]);
        let settlement = policy
            .settle(&[Damage { item_type: ItemType::Sword, amount: 1000 }])
            .unwrap();
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn the_fifty_percent_rule_wins_over_dragon_material() {
        let dragon_sword = Item {
            material: Material::Dragon,
            enchantment: 9,
            ..sword()
        };
        let mut policy = Policy::covering(&[dragon_sword]);
        let settlement = policy
            .settle(&[Damage { item_type: ItemType::Sword, amount: 1000 }])
            .unwrap();
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn the_deductible_applies_once_per_damaged_item() {
        let amulet = Item { item_type: ItemType::Amulet, ..Default::default() };
        let mut policy = Policy::covering(&[sword(), amulet]);
        let settlement = policy
            .settle(&[
                Damage { item_type: ItemType::Sword, amount: 500 },
                Damage { item_type: ItemType::Amulet, amount: 300 },
            ])
            .unwrap();
        assert_eq!(settlement.payout, 600);
    }

    #[test]
    fn a_fractional_payout_is_rounded_down() {
        // 901 at 50 % = 450.5, less the 100 deductible = 350.5 -> 350
        let mut policy = Policy::covering(&[Item { enchantment: 9, ..sword() }]);
        let settlement = policy
            .settle(&[Damage { item_type: ItemType::Sword, amount: 901 }])
            .unwrap();
        assert_eq!(settlement.payout, 350);
    }

    #[test]
    fn the_cap_is_twice_the_sum_of_the_items_insurance_values() {
        let amulet = Item { item_type: ItemType::Amulet, ..Default::default() };
        let policy = Policy::covering(&[sword(), amulet]);
        assert_eq!(policy.insurance_sum(), 1600);
        assert_eq!(policy.remaining_cap(), 3200);
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        let cursed_sword = Item { cursed: true, enchantment: 3, ..sword() };
        assert_eq!(quote(&newcomer(), std::slice::from_ref(&cursed_sword)), 165);
        let policy = Policy::covering(&[cursed_sword]);
        assert_eq!(policy.remaining_cap(), 2000);
    }

    #[test]
    fn the_block_discount_does_not_reduce_the_insurance_sum() {
        let mut items = vec![sword()];
        items.extend((0..3).map(|_| Item { item_type: ItemType::Rune, ..Default::default() }));
        // the block lowers the base premium to 100 + 60, but not the insured sum
        assert_eq!(policy_base_premium(&items), 160);
        assert_eq!(Policy::covering(&items).insurance_sum(), 1750);
    }

    #[test]
    fn successive_claims_exhaust_the_remaining_cap() {
        let mut policy = Policy::covering(&[sword()]);
        let first = policy
            .settle(&[Damage { item_type: ItemType::Sword, amount: 1500 }])
            .unwrap();
        assert_eq!(first.payout, 1400);
        assert_eq!(first.remaining_cap, 600);
        let second = policy
            .settle(&[Damage { item_type: ItemType::Sword, amount: 1500 }])
            .unwrap();
        assert_eq!(second.payout, 600);
        assert_eq!(second.remaining_cap, 0);
    }

    #[test]
    fn two_items_of_the_same_type_each_add_their_insurance_value() {
        let policy = Policy::covering(&[sword(), sword()]);
        assert_eq!(policy.insurance_sum(), 2000);
        assert_eq!(policy.remaining_cap(), 4000);
    }

    #[test]
    fn each_damage_entry_of_a_repeated_type_gets_its_own_deductible() {
        let mut policy = Policy::covering(&[sword(), sword()]);
        let settlement = policy
            .settle(&[
                Damage { item_type: ItemType::Sword, amount: 500 },
                Damage { item_type: ItemType::Sword, amount: 300 },
            ])
            .unwrap();
        assert_eq!(settlement.payout, 600);
    }

    #[test]
    fn more_damage_entries_than_insured_items_of_that_type_is_rejected() {
        let mut policy = Policy::covering(&[sword()]);
        let refusal = policy.settle(&[
            Damage { item_type: ItemType::Sword, amount: 500 },
            Damage { item_type: ItemType::Sword, amount: 300 },
        ]);
        assert!(refusal.is_err());
    }

    #[test]
    fn a_claim_for_an_item_outside_the_policy_is_rejected() {
        let mut policy = Policy::covering(&[sword()]);
        let refusal = policy.settle(&[Damage { item_type: ItemType::Amulet, amount: 200 }]);
        assert!(refusal.is_err());
        // the refused claim consumes none of the policy's cap
        assert_eq!(policy.remaining_cap(), 2000);
    }

    #[test]
    fn a_claim_for_an_unknown_item_type_is_rejected() {
        // a damage entry's itemType is translated by the same rule as a quote's
        assert!(ItemType::from_name("broomstick").is_err());
    }

    #[test]
    fn a_negative_damage_amount_is_rejected() {
        let mut policy = Policy::covering(&[sword()]);
        let refusal = policy.settle(&[Damage { item_type: ItemType::Sword, amount: -200 }]);
        assert!(refusal.is_err());
    }

    #[test]
    fn a_scenario_produces_one_result_per_step_in_order() {
        let scenario = r#"{
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
        // amulet: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
        // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
        assert_eq!(
            run_scenario(scenario).unwrap(),
            r#"{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}"#
        );
    }

    #[test]
    fn a_claim_step_refers_to_an_earlier_quote_step_by_index() {
        let scenario = r#"{
            "customer": {"yearsWithMHPCO": 0},
            "steps": [
                {"op": "quote", "items": [{"type": "sword"}]},
                {"op": "quote", "items": [{"type": "amulet"}]},
                {"op": "claim", "policy": 1, "incident": {
                    "cause": "fire",
                    "damages": [{"itemType": "amulet", "amount": 300}]
                }}
            ]
        }"#;
        // the claim settles against step 1's amulet policy: cap 1200,
        // payout 300 - 100 = 200, remaining 1000
        let results = run_scenario(scenario).unwrap();
        assert!(
            results.ends_with(r#"{"payout":200,"remainingCap":1000}]}"#),
            "{results}"
        );
    }
}
