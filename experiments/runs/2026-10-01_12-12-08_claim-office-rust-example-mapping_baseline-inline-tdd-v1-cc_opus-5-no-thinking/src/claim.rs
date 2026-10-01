use crate::money::{CENTS, round_down};
use crate::quote::Item;

const DEDUCTIBLE: i64 = 100;

/// One damaged item within an incident. Each entry carries its own deductible.
pub struct Damage {
    pub item_type: String,
    pub amount: i64,
}

#[derive(Debug)]
pub struct ClaimResult {
    pub payout: i64,
    pub remaining_cap: i64,
}

/// A policy as seen from the claims desk: the insured items plus the cap that
/// successive claims eat into.
pub struct ClaimablePolicy {
    insured: Vec<InsuredItem>,
    remaining_cap: i64,
}

/// What the claims desk needs to know about one insured item: how the special
/// clauses treat it.
struct InsuredItem {
    kind: String,
    halved: bool,
}

impl InsuredItem {
    /// Reimbursable share of a damage amount, in hundredths of G, before the
    /// deductible. Damage is reimbursed in full unless the item is highly
    /// enchanted — that clause wins even over the dragon-material clause,
    /// which grants the full reimbursement that is the default anyway.
    fn reimbursable(&self, amount: i64) -> i64 {
        if self.halved {
            amount * CENTS / 2
        } else {
            amount * CENTS
        }
    }
}

impl ClaimablePolicy {
    pub fn new(items: &[Item], cap: i64) -> Self {
        let insured = items
            .iter()
            .map(|item| InsuredItem {
                kind: item.kind.clone(),
                halved: item.enchantment >= 8,
            })
            .collect();
        Self { insured, remaining_cap: cap }
    }

    /// Payout for a single damage entry, in hundredths of G, after its own
    /// deductible. Consumes the insured item that answers for it.
    fn reimburse(unclaimed: &mut Vec<&InsuredItem>, damage: &Damage) -> Result<i64, String> {
        if damage.amount < 0 {
            return Err(format!("negative damage amount: {}", damage.amount));
        }
        let position = unclaimed
            .iter()
            .position(|i| i.kind == damage.item_type)
            .ok_or_else(|| format!("item not covered by the policy: {}", damage.item_type))?;
        let item = unclaimed.swap_remove(position);
        Ok((item.reimbursable(damage.amount) - DEDUCTIBLE * CENTS).max(0))
    }

    pub fn claim(&mut self, damages: &[Damage]) -> Result<ClaimResult, String> {
        let mut payout = 0;
        // Each insured item answers for at most one damage entry per incident,
        // so a claim listing more swords than the policy covers is rejected.
        let mut unclaimed: Vec<&InsuredItem> = self.insured.iter().collect();
        for damage in damages {
            payout += Self::reimburse(&mut unclaimed, damage)?;
        }
        let payout = round_down(payout).clamp(0, self.remaining_cap);
        self.remaining_cap -= payout;
        Ok(ClaimResult {
            payout,
            remaining_cap: self.remaining_cap,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::quote::Item;

    fn sword(material: &str, enchantment: i64) -> Item {
        Item {
            kind: "sword".to_string(),
            material: material.to_string(),
            enchantment,
            cursed: false,
        }
    }

    fn damage(item_type: &str, amount: i64) -> Damage {
        Damage { item_type: item_type.to_string(), amount }
    }

    fn payout_for(item: &Item, damages: &[Damage]) -> i64 {
        let mut policy = ClaimablePolicy::new(std::slice::from_ref(item), 1_000_000);
        policy.claim(damages).unwrap().payout
    }

    #[test]
    fn a_plain_item_is_reimbursed_in_full_minus_the_deductible() {
        let mut policy = ClaimablePolicy::new(&[sword("steel", 3)], 2000);
        let result = policy.claim(&[damage("sword", 500)]).unwrap();
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn a_component_has_no_special_clause() {
        let rune = Item { kind: "rune".to_string(), ..Item::default() };
        assert_eq!(payout_for(&rune, &[damage("rune", 200)]), 100);
    }

    #[test]
    fn high_enchantment_halves_the_damage_before_the_deductible() {
        assert_eq!(payout_for(&sword("steel", 9), &[damage("sword", 1000)]), 400);
        // the clause starts at exactly 8
        assert_eq!(payout_for(&sword("steel", 8), &[damage("sword", 1000)]), 400);
        assert_eq!(payout_for(&sword("steel", 7), &[damage("sword", 1000)]), 900);
    }

    #[test]
    fn dragon_material_is_reimbursed_in_full() {
        assert_eq!(payout_for(&sword("dragon", 5), &[damage("sword", 800)]), 700);
    }

    #[test]
    fn the_halving_clause_wins_over_dragon_material() {
        assert_eq!(payout_for(&sword("dragon", 9), &[damage("sword", 1000)]), 400);
        assert_eq!(payout_for(&sword("dragon", 8), &[damage("sword", 1000)]), 400);
    }

    #[test]
    fn a_fractional_payout_is_rounded_down() {
        // 901 halved is 450.5, minus the deductible 350.5 -> 350
        assert_eq!(payout_for(&sword("steel", 9), &[damage("sword", 901)]), 350);
    }

    #[test]
    fn a_damage_to_an_uninsured_item_is_rejected() {
        let mut policy = ClaimablePolicy::new(&[sword("steel", 3)], 2000);
        let err = policy.claim(&[damage("amulet", 300)]).unwrap_err();
        assert!(err.contains("amulet"), "error should name the item: {err}");
    }

    #[test]
    fn a_negative_damage_amount_is_rejected() {
        let mut policy = ClaimablePolicy::new(&[sword("steel", 3)], 2000);
        assert!(policy.claim(&[damage("sword", -200)]).is_err());
    }

    #[test]
    fn two_of_the_same_item_can_each_be_damaged_separately() {
        let mut policy = ClaimablePolicy::new(&[sword("steel", 3), sword("steel", 3)], 4000);
        let result = policy
            .claim(&[damage("sword", 500), damage("sword", 300)])
            .unwrap();
        // each entry carries its own deductible: 400 + 200
        assert_eq!(result.payout, 600);
    }

    #[test]
    fn more_damages_of_a_type_than_insured_items_are_rejected() {
        let mut policy = ClaimablePolicy::new(&[sword("steel", 3)], 2000);
        assert!(
            policy
                .claim(&[damage("sword", 500), damage("sword", 300)])
                .is_err()
        );
    }

    #[test]
    fn a_damage_below_the_deductible_pays_nothing_and_offsets_nothing() {
        let mut policy = ClaimablePolicy::new(
            &[sword("steel", 3), Item { kind: "amulet".to_string(), ..Item::default() }],
            4000,
        );
        let result = policy
            .claim(&[damage("sword", 500), damage("amulet", 40)])
            .unwrap();
        assert_eq!(result.payout, 400);
    }

    #[test]
    fn successive_claims_eat_into_the_cap() {
        let mut policy = ClaimablePolicy::new(&[sword("steel", 3)], 2000);

        let first = policy.claim(&[damage("sword", 1500)]).unwrap();
        assert_eq!(first.payout, 1400);
        assert_eq!(first.remaining_cap, 600);

        let second = policy.claim(&[damage("sword", 1500)]).unwrap();
        assert_eq!(second.payout, 600);
        assert_eq!(second.remaining_cap, 0);

        let third = policy.claim(&[damage("sword", 1500)]).unwrap();
        assert_eq!(third.payout, 0);
        assert_eq!(third.remaining_cap, 0);
    }

    #[test]
    fn the_deductible_applies_once_per_damaged_item() {
        let mut policy = ClaimablePolicy::new(
            &[sword("steel", 3), Item { kind: "amulet".to_string(), ..Item::default() }],
            1_000_000,
        );
        let result = policy
            .claim(&[damage("sword", 500), damage("amulet", 300)])
            .unwrap();
        assert_eq!(result.payout, 600);
    }
}
