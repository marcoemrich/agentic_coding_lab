//! The MHPCO's policy management: quoting premiums and settling claims.

mod scenario;

pub use scenario::run_scenario;

// ---- What the MHPCO insures ----

/// The material an insured item is made of; dragon material is privileged.
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Material {
    Dragon,
    Other,
}

impl Material {
    /// Reads a material from the name a scenario document uses for it.
    pub fn parse(name: &str) -> Self {
        match name {
            "dragon" => Material::Dragon,
            _ => Material::Other,
        }
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum ItemType {
    Sword,
    Amulet,
    Staff,
    Potion,
    Rune,
    Moonstone,
}

impl ItemType {
    /// Reads an item type from the name the MHPCO's price list uses for it.
    pub fn parse(name: &str) -> Result<Self, String> {
        match name {
            "sword" => Ok(ItemType::Sword),
            "amulet" => Ok(ItemType::Amulet),
            "staff" => Ok(ItemType::Staff),
            "potion" => Ok(ItemType::Potion),
            "rune" => Ok(ItemType::Rune),
            "moonstone" => Ok(ItemType::Moonstone),
            unknown => Err(format!("unknown item type: {unknown}")),
        }
    }

    /// Components such as runes and moonstones are priced as a category.
    fn is_component(self) -> bool {
        matches!(self, ItemType::Rune | ItemType::Moonstone)
    }
}

#[derive(Clone, Copy)]
pub struct Item {
    pub item_type: ItemType,
    pub cursed: bool,
    /// Components such as runes carry no enchantment level.
    pub enchantment: Option<u32>,
    /// Components such as runes are made of no insured material.
    pub material: Option<Material>,
}

pub struct Customer {
    pub years_with_mhpco: u32,
}

/// Whether a quote is the customer's first contract or a follow-up one.
#[derive(Clone, Copy, PartialEq, Eq)]
pub enum ContractNumber {
    First,
    FollowUp,
}

// ---- Rounding in the MHPCO's favor ----

/// A premium is rounded up, a payout down: both in the MHPCO's favor.
fn premium_in_mhpco_favor(amount: f64) -> u64 {
    amount.ceil() as u64
}

fn payout_in_mhpco_favor(amount: f64) -> u64 {
    amount.floor() as u64
}

// ---- The price list: base premiums ----

/// One base premium covers every component kind the MHPCO insures.
const COMPONENT_BASE_PREMIUM: f64 = 25.0;

/// The component kinds the MHPCO insures, each priced as its own alike group.
const COMPONENT_TYPES: [ItemType; 2] = [ItemType::Rune, ItemType::Moonstone];

/// A building block of exactly this many alike components earns the block price.
const COMPONENT_BLOCK_SIZE: usize = 3;

/// The special base premium for one building block of alike components.
const COMPONENT_BLOCK_BASE_PREMIUM: f64 = 60.0;

fn base_premium(item: &Item) -> f64 {
    match item.item_type {
        ItemType::Sword => 100.0,
        ItemType::Amulet => 60.0,
        ItemType::Staff => 80.0,
        ItemType::Potion => 40.0,
        ItemType::Rune | ItemType::Moonstone => COMPONENT_BASE_PREMIUM,
    }
}

/// Alike components earn the block price only when exactly a block is insured.
fn components_base_premium(count: usize) -> f64 {
    if count == COMPONENT_BLOCK_SIZE {
        COMPONENT_BLOCK_BASE_PREMIUM
    } else {
        count as f64 * COMPONENT_BASE_PREMIUM
    }
}

/// Components are alike when they share an item type, so each kind forms its
/// own building blocks.
fn alike_components_base_premium(items: &[Item]) -> f64 {
    COMPONENT_TYPES
        .iter()
        .map(|kind| items.iter().filter(|item| item.item_type == *kind).count())
        .map(components_base_premium)
        .sum()
}

/// The base premium of a whole policy: what policy-wide modifiers apply to.
fn policy_base_premium(items: &[Item]) -> f64 {
    let main_items: f64 = items
        .iter()
        .filter(|item| !item.item_type.is_component())
        .map(base_premium)
        .sum();

    main_items + alike_components_base_premium(items)
}

// ---- Premium modifiers ----

/// Every premium carries the MHPCO's flat processing fee.
const PROCESSING_FEE: u64 = 5;

/// Risk surcharge on the base premium of a cursed item.
const CURSE_SURCHARGE: f64 = 0.50;

/// From this enchantment level on, an item counts as highly enchanted.
const HIGH_ENCHANTMENT_LEVEL: u32 = 5;

/// Risk surcharge on the base premium of a highly enchanted item.
const HIGH_ENCHANTMENT_SURCHARGE: f64 = 0.30;

/// Share of the policy base premium charged for a first insurance.
const FIRST_INSURANCE_SURCHARGE: f64 = 0.10;

/// Discount on every contract the customer takes out after their first.
const FOLLOW_UP_CONTRACT_DISCOUNT: f64 = 0.15;

/// From this many years of business on, a customer counts as long-standing.
const LOYALTY_YEARS: u32 = 2;

/// Discount on the policy base premium for a long-standing customer.
const LOYALTY_DISCOUNT: f64 = 0.20;

impl Customer {
    /// A customer is long-standing after enough years of business with MHPCO.
    fn is_long_standing(&self) -> bool {
        self.years_with_mhpco >= LOYALTY_YEARS
    }
}

/// Surcharges the MHPCO charges for the risk of one individual item.
fn item_risk_surcharges(item: &Item) -> f64 {
    let mut rate = 0.0;
    if item.cursed {
        rate += CURSE_SURCHARGE;
    }
    if item.is_highly_enchanted() {
        rate += HIGH_ENCHANTMENT_SURCHARGE;
    }

    base_premium(item) * rate
}

/// Modifiers the MHPCO applies to the policy base premium as a whole.
fn policy_modifier_rate(customer: &Customer, contract: ContractNumber) -> f64 {
    let mut rate = FIRST_INSURANCE_SURCHARGE;
    if customer.is_long_standing() {
        rate -= LOYALTY_DISCOUNT;
    }
    if contract == ContractNumber::FollowUp {
        rate -= FOLLOW_UP_CONTRACT_DISCOUNT;
    }

    rate
}

// ---- Insured values, the policy and its payout cap ----

/// Every component kind the MHPCO insures carries this insurance value.
const COMPONENT_INSURANCE_VALUE: u64 = 250;

/// The total payout per policy is capped at this multiple of the insurance sum.
const PAYOUT_CAP_MULTIPLE: u64 = 2;

fn insurance_value(item: &Item) -> u64 {
    match item.item_type {
        ItemType::Sword => 1000,
        ItemType::Amulet => 600,
        ItemType::Staff => 800,
        ItemType::Potion => 400,
        ItemType::Rune | ItemType::Moonstone => COMPONENT_INSURANCE_VALUE,
    }
}

/// The insurance sum a policy covers: the MHPCO's insured value of its items.
fn insurance_sum(items: &[Item]) -> u64 {
    items.iter().map(insurance_value).sum()
}

/// The MHPCO pays out at most twice an insurance sum over a policy's life.
fn payout_cap(insurance_sum: u64) -> u64 {
    insurance_sum * PAYOUT_CAP_MULTIPLE
}

/// A policy the MHPCO issued for a quoted list of items.
pub struct Policy {
    pub premium: u64,
    pub insurance_sum: u64,
    /// The items this policy covers; a claim is settled against them.
    pub items: Vec<Item>,
    /// How much of the policy's payout cap successive claims have not used up.
    remaining_cap: u64,
}

impl Policy {
    /// The MHPCO issues a policy with its full payout cap still available.
    fn issue(premium: u64, items: &[Item]) -> Self {
        let insurance_sum = insurance_sum(items);

        Policy {
            premium,
            insurance_sum,
            items: items.to_vec(),
            remaining_cap: payout_cap(insurance_sum),
        }
    }

    /// Pays out as much of a desired amount as the remaining cap allows,
    /// and uses that much of the cap up.
    fn draw_from_cap(&mut self, desired: u64) -> u64 {
        let paid = desired.min(self.remaining_cap);
        self.remaining_cap -= paid;

        paid
    }

    /// The cap on everything this policy will ever pay out.
    pub fn cap(&self) -> u64 {
        payout_cap(self.insurance_sum)
    }
}

/// Quotes a list of items: the premium the MHPCO charges and the policy it
/// issues for them.
pub fn quote(
    customer: &Customer,
    items: &[Item],
    contract: ContractNumber,
) -> Result<Policy, String> {
    let policy_base = policy_base_premium(items);
    let item_risk: f64 = items.iter().map(item_risk_surcharges).sum();
    let modifiers = policy_base * policy_modifier_rate(customer, contract);
    let premium = policy_base + item_risk + modifiers + PROCESSING_FEE as f64;

    Ok(Policy::issue(premium_in_mhpco_favor(premium), items))
}

// ---- Claim processing ----

/// The MHPCO keeps this much of every damage event.
const DEDUCTIBLE: u64 = 100;

/// From this enchantment level on, damage is only half reimbursed.
const HALF_REIMBURSEMENT_LEVEL: u32 = 8;

/// Share of the damage the MHPCO reimburses for a heavily enchanted item.
const HALF_REIMBURSEMENT_SHARE: f64 = 0.50;

impl Item {
    /// An item is highly enchanted from the threshold enchantment level on.
    fn is_highly_enchanted(&self) -> bool {
        self.enchantment
            .is_some_and(|level| level >= HIGH_ENCHANTMENT_LEVEL)
    }

    /// From a higher level on, the MHPCO reimburses only half the damage.
    fn is_heavily_enchanted(&self) -> bool {
        self.enchantment
            .is_some_and(|level| level >= HALF_REIMBURSEMENT_LEVEL)
    }
}

/// One damaged item and the damage the MHPCO is asked to reimburse.
pub struct Damage {
    pub item_type: ItemType,
    pub amount: i64,
}

/// A damage event reported against a policy.
pub struct Incident {
    pub damages: Vec<Damage>,
}

/// What the MHPCO settles for one reported incident.
pub struct Settlement {
    pub payout: u64,
    pub remaining_cap: u64,
}

/// How much of a reported damage the MHPCO's clauses make reimbursable. The
/// half-reimbursement clause takes precedence; every other damage, including
/// dragon material, is reimbursed in full.
fn reimbursable_damage(item: &Item, damage: &Damage) -> f64 {
    if item.is_heavily_enchanted() {
        damage.amount as f64 * HALF_REIMBURSEMENT_SHARE
    } else {
        damage.amount as f64
    }
}

/// What the MHPCO reimburses for one damaged item, before the policy cap.
fn reimbursement(item: &Item, damage: &Damage) -> u64 {
    payout_in_mhpco_favor(reimbursable_damage(item, damage)).saturating_sub(DEDUCTIBLE)
}

/// The MHPCO only reimburses a damage that reports a non-negative amount.
fn validate_reported_amount(damage: &Damage) -> Result<(), String> {
    if damage.amount < 0 {
        return Err(format!(
            "damage amount must not be negative: {}",
            damage.amount
        ));
    }

    Ok(())
}

/// Each reported damage must concern a distinct item the policy covers;
/// otherwise the MHPCO rejects the whole claim.
fn damaged_items(policy: &Policy, incident: &Incident) -> Result<Vec<Item>, String> {
    let mut uninjured = policy.items.clone();
    let mut damaged = Vec::new();
    for damage in &incident.damages {
        validate_reported_amount(damage)?;
        let insured = uninjured
            .iter()
            .position(|item| item.item_type == damage.item_type)
            .ok_or_else(|| {
                format!(
                    "damaged item is not covered by the policy: {:?}",
                    damage.item_type
                )
            })?;
        damaged.push(uninjured.swap_remove(insured));
    }

    Ok(damaged)
}

/// Settles one reported incident against a policy, drawing on its payout cap.
pub fn claim(policy: &mut Policy, incident: &Incident) -> Result<Settlement, String> {
    let damaged = damaged_items(policy, incident)?;
    let payout: u64 = damaged
        .iter()
        .zip(&incident.damages)
        .map(|(item, damage)| reimbursement(item, damage))
        .sum();
    let payout = policy.draw_from_cap(payout);

    Ok(Settlement {
        payout,
        remaining_cap: policy.remaining_cap,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    /// An ordinary insured item: not cursed.
    fn plain(item_type: ItemType) -> Item {
        Item {
            item_type,
            cursed: false,
            enchantment: None,
            material: None,
        }
    }

    // ---- Premium: processing fee and the item price list ----

    #[test]
    fn empty_item_list_costs_only_the_processing_fee() {
        let customer = Customer { years_with_mhpco: 0 };

        assert_eq!(quote(&customer, &[], ContractNumber::First).map(|policy| policy.premium), Ok(5));
    }

    #[test]
    fn sword_has_base_premium_100() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword)];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(115));
    }

    #[test]
    fn amulet_has_base_premium_60() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Amulet)];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(71));
    }

    #[test]
    fn staff_has_base_premium_80() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Staff)];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(93));
    }

    #[test]
    fn potion_has_base_premium_40() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Potion)];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(49));
    }

    #[test]
    fn rune_has_component_base_premium_25() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Rune)];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(33));
    }

    #[test]
    fn moonstone_has_component_base_premium_25() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Moonstone)];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(33));
    }

    // ---- Premium: component building blocks ----

    #[test]
    fn two_runes_have_base_premium_50() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            plain(ItemType::Rune),
            plain(ItemType::Rune),
        ];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(60));
    }

    #[test]
    fn three_alike_components_form_a_block_priced_60() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            plain(ItemType::Rune),
            plain(ItemType::Rune),
            plain(ItemType::Rune),
        ];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(71));
    }

    #[test]
    fn four_runes_have_base_premium_100() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Rune); 4];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(115));
    }

    #[test]
    fn seven_runes_have_base_premium_175() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Rune); 7];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(198));
    }

    #[test]
    fn block_requires_components_of_the_same_type() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            plain(ItemType::Rune),
            plain(ItemType::Rune),
            plain(ItemType::Moonstone),
        ];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(88));
    }

    #[test]
    fn two_separate_blocks_of_different_component_types() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            plain(ItemType::Rune),
            plain(ItemType::Rune),
            plain(ItemType::Rune),
            plain(ItemType::Moonstone),
            plain(ItemType::Moonstone),
            plain(ItemType::Moonstone),
        ];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(137));
    }

    // ---- Premium: item-specific modifiers ----

    #[test]
    fn cursed_item_adds_fifty_percent_risk_surcharge() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: true,
            enchantment: Some(3),
            material: None,
        }];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(165));
    }

    #[test]
    fn enchantment_five_adds_thirty_percent_risk_surcharge() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(5),
            material: None,
        }];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(145));
    }

    #[test]
    fn enchantment_four_adds_no_high_enchantment_surcharge() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(4),
            material: None,
        }];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(115));
    }

    #[test]
    fn cursed_and_highly_enchanted_item_gets_both_surcharges() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: true,
            enchantment: Some(5),
            material: None,
        }];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(195));
    }

    #[test]
    fn item_modifier_applies_only_to_the_affected_items_base_premium() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            Item {
                item_type: ItemType::Sword,
                cursed: true,
                enchantment: Some(3),
                material: None,
            },
            plain(ItemType::Amulet),
        ];

        // policy base 160 + curse 50 (50 % of the sword's 100, not of 160)
        // + first insurance 16 (10 % of 160) + 5 fee
        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(231));
    }

    // ---- Premium: policy-wide modifiers ----

    #[test]
    fn first_insurance_adds_ten_percent_initial_assessment() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Staff)];

        // policy base 80 + first insurance 8 + 5 fee
        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(93));
    }

    #[test]
    fn exactly_two_years_grants_the_loyalty_discount() {
        let customer = Customer { years_with_mhpco: 2 };
        let items = [plain(ItemType::Sword)];

        // policy base 100 + first insurance 10 - loyalty 20 + 5 fee
        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(95));
    }

    #[test]
    fn one_year_grants_no_loyalty_discount() {
        let customer = Customer { years_with_mhpco: 1 };
        let items = [plain(ItemType::Sword)];

        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(115));
    }

    #[test]
    fn follow_up_contract_grants_fifteen_percent_discount() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword)];

        // policy base 100 + first insurance 10 - follow-up 15 + 5 fee
        assert_eq!(quote(&customer, &items, ContractNumber::FollowUp).map(|policy| policy.premium), Ok(100));
    }

    #[test]
    fn first_insurance_surcharge_also_applies_on_a_follow_up_contract() {
        let customer = Customer { years_with_mhpco: 3 };
        let items = [plain(ItemType::Sword)];

        // policy base 100 + first insurance 10 - loyalty 20 - follow-up 15
        // + 5 fee; without the first insurance surcharge this would be 70
        assert_eq!(quote(&customer, &items, ContractNumber::FollowUp).map(|policy| policy.premium), Ok(80));
    }

    // ---- Premium: rounding ----

    #[test]
    fn premium_is_rounded_up() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Rune); 7];

        // 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(198));
    }

    #[test]
    fn only_the_final_premium_is_rounded() {
        let customer = Customer { years_with_mhpco: 2 };
        let items = [plain(ItemType::Rune)];

        // 25 base + 2.5 first insurance - 5 loyalty - 3.75 follow-up + 5 fee
        // = 23.75 -> 24; rounding each step separately would not give 24
        assert_eq!(quote(&customer, &items, ContractNumber::FollowUp).map(|policy| policy.premium), Ok(24));
    }

    // ---- Premium: integration examples ----

    #[test]
    fn newcomer_with_a_cursed_sword_pays_165() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: true,
            enchantment: Some(3),
            material: None,
        }];

        // 100 base + 50 curse + 10 first insurance = 160 + 5 fee
        assert_eq!(quote(&customer, &items, ContractNumber::First).map(|policy| policy.premium), Ok(165));
    }

    #[test]
    fn long_standing_customers_second_contract_pays_160() {
        let customer = Customer { years_with_mhpco: 3 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: true,
            enchantment: Some(7),
            material: None,
        }];

        // 100 base + 50 curse + 30 high enchantment - 20 loyalty
        // + 10 first insurance - 15 follow-up = 155 + 5 fee
        assert_eq!(quote(&customer, &items, ContractNumber::FollowUp).map(|policy| policy.premium), Ok(160));
    }

    // ---- Insurance sum and cap ----

    #[test]
    fn insurance_sum_is_the_sum_of_item_insurance_values() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword), plain(ItemType::Amulet)];

        let policy = quote(&customer, &items, ContractNumber::First).unwrap();

        assert_eq!(policy.insurance_sum, 1600);
        assert_eq!(policy.cap(), 3200);
    }

    #[test]
    fn two_items_of_the_same_type_both_count_toward_the_insurance_sum() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword); 2];

        let policy = quote(&customer, &items, ContractNumber::First).unwrap();

        assert_eq!(policy.insurance_sum, 2000);
        assert_eq!(policy.cap(), 4000);
    }

    #[test]
    fn premium_modifiers_do_not_raise_the_cap() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: true,
            enchantment: Some(3),
            material: None,
        }];

        let policy = quote(&customer, &items, ContractNumber::First).unwrap();

        assert_eq!(policy.premium, 165);
        assert_eq!(policy.cap(), 2000);
    }

    #[test]
    fn block_discount_does_not_reduce_the_insurance_sum() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [
            plain(ItemType::Sword),
            plain(ItemType::Rune),
            plain(ItemType::Rune),
            plain(ItemType::Rune),
        ];

        let policy = quote(&customer, &items, ContractNumber::First).unwrap();

        // insurance sum ignores the 60 G block price: 1000 + 3 x 250
        assert_eq!(policy.insurance_sum, 1750);
        // premium does use the block: 100 + 60 = 160 base + 16 + 5 fee
        assert_eq!(policy.premium, 181);
    }

    // ---- Claim: standard reimbursement and deductible ----

    #[test]
    fn standard_damage_is_fully_reimbursed_minus_the_deductible() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(3),
            material: None,
        }];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 500,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn component_damage_has_no_special_clause() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Rune)];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Rune,
                amount: 200,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        assert_eq!(settlement.payout, 100);
    }

    #[test]
    fn the_deductible_applies_once_per_damage_entry() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword), plain(ItemType::Amulet)];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![
                Damage {
                    item_type: ItemType::Sword,
                    amount: 500,
                },
                Damage {
                    item_type: ItemType::Amulet,
                    amount: 300,
                },
            ],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        // 400 + 200: the 100 G deductible applies once per damaged item
        assert_eq!(settlement.payout, 600);
    }

    #[test]
    fn repeated_item_type_damages_each_carry_their_own_deductible() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword); 2];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![
                Damage {
                    item_type: ItemType::Sword,
                    amount: 500,
                },
                Damage {
                    item_type: ItemType::Sword,
                    amount: 500,
                },
            ],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        // two separate damages, each with its own 100 G deductible
        assert_eq!(settlement.payout, 800);
    }

    // ---- Claim: special clauses ----

    #[test]
    fn high_enchantment_damage_is_reimbursed_at_fifty_percent() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(9),
            material: None,
        }];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 1000,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        // 50 % of 1000 = 500, then the 100 G deductible
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn enchantment_exactly_eight_triggers_the_fifty_percent_clause() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(8),
            material: None,
        }];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 1000,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn dragon_material_damage_is_fully_reimbursed() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(5),
            material: Some(Material::Dragon),
        }];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 800,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        // full reimbursement, then the 100 G deductible
        assert_eq!(settlement.payout, 700);
    }

    #[test]
    fn high_enchantment_clause_wins_over_dragon_material() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(9),
            material: Some(Material::Dragon),
        }];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 1000,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        // both clauses apply; the 50 % rule wins, then the deductible
        assert_eq!(settlement.payout, 400);
    }

    #[test]
    fn dragon_material_with_enchantment_exactly_eight_pays_400() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(8),
            material: Some(Material::Dragon),
        }];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 1000,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        // high-enchantment clause applies, then the deductible
        assert_eq!(settlement.payout, 400);
    }

    // ---- Claim: cap exhaustion across successive claims ----

    #[test]
    fn first_claim_reduces_the_remaining_cap() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword)];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 1500,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        // cap 2000; payout 1500 - 100 deductible
        assert_eq!(settlement.payout, 1400);
        assert_eq!(settlement.remaining_cap, 600);
    }

    #[test]
    fn a_claim_is_limited_to_the_remaining_cap() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword)];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = || Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 1500,
            }],
        };

        claim(&mut policy, &incident()).unwrap();
        let settlement = claim(&mut policy, &incident()).unwrap();

        // the desired 1400 is reduced to the remaining 600
        assert_eq!(settlement.payout, 600);
        assert_eq!(settlement.remaining_cap, 0);
    }

    // ---- Claim: rounding ----

    #[test]
    fn payout_is_rounded_down() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [Item {
            item_type: ItemType::Sword,
            cursed: false,
            enchantment: Some(9),
            material: None,
        }];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: 901,
            }],
        };

        let settlement = claim(&mut policy, &incident).unwrap();

        // 50 % of 901 = 450.5 -> 450, then the 100 G deductible
        assert_eq!(settlement.payout, 350);
    }

    // ---- Error cases: observable contract is an Err result from the library, which the CLI turns into a non-zero exit with stderr ----

    #[test]
    fn unknown_item_type_in_a_quote_is_rejected() {
        assert_eq!(ItemType::parse("sword"), Ok(ItemType::Sword));
        assert_eq!(ItemType::parse("amulet"), Ok(ItemType::Amulet));
        assert_eq!(ItemType::parse("staff"), Ok(ItemType::Staff));
        assert_eq!(ItemType::parse("potion"), Ok(ItemType::Potion));
        assert_eq!(ItemType::parse("rune"), Ok(ItemType::Rune));
        assert_eq!(ItemType::parse("moonstone"), Ok(ItemType::Moonstone));
        assert!(ItemType::parse("broomstick").is_err());
    }

    #[test]
    fn damage_to_an_item_outside_the_policy_is_rejected() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword)];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Amulet,
                amount: 300,
            }],
        };

        assert!(claim(&mut policy, &incident).is_err());
    }

    #[test]
    fn damage_with_an_unknown_item_type_is_rejected() {
        // a damage entry names its item the same way a quoted item does; the
        // end-to-end rejection is observed by the CLI test of the same name
        assert!(ItemType::parse("broomstick").is_err());
    }

    #[test]
    fn more_damage_entries_of_a_type_than_insured_items_is_rejected() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword)];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![
                Damage {
                    item_type: ItemType::Sword,
                    amount: 500,
                },
                Damage {
                    item_type: ItemType::Sword,
                    amount: 500,
                },
            ],
        };

        assert!(claim(&mut policy, &incident).is_err());
    }

    #[test]
    fn negative_damage_amount_is_rejected() {
        let customer = Customer { years_with_mhpco: 0 };
        let items = [plain(ItemType::Sword)];
        let mut policy = quote(&customer, &items, ContractNumber::First).unwrap();
        let incident = Incident {
            damages: vec![Damage {
                item_type: ItemType::Sword,
                amount: -200,
            }],
        };

        assert!(claim(&mut policy, &incident).is_err());
    }
}
