//! The MHPCO price list: insurance value and base premium per item type.

/// An entry from the MHPCO price list.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ItemSpec {
    pub insurance_value: i64,
    pub base_premium: i64,
    pub is_component: bool,
}

/// Looks up `item_type` in the price list. `None` for types the MHPCO does not cover.
pub fn lookup(item_type: &str) -> Option<ItemSpec> {
    let (insurance_value, base_premium, is_component) = match item_type {
        "sword" => (1000, 100, false),
        "amulet" => (600, 60, false),
        "staff" => (800, 80, false),
        "potion" => (400, 40, false),
        "rune" | "moonstone" => (250, 25, true),
        _ => return None,
    };
    Some(ItemSpec { insurance_value, base_premium, is_component })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sword_is_1000_g_insured_at_100_g_base_premium() {
        let spec = lookup("sword").expect("sword is on the price list");
        assert_eq!(spec.insurance_value, 1000);
        assert_eq!(spec.base_premium, 100);
    }

    #[test]
    fn main_items_follow_the_price_list() {
        for (item_type, value, premium) in
            [("amulet", 600, 60), ("staff", 800, 80), ("potion", 400, 40)]
        {
            let spec = lookup(item_type).expect("on the price list");
            assert_eq!((spec.insurance_value, spec.base_premium), (value, premium));
        }
    }

    #[test]
    fn components_are_insured_at_250_g_for_25_g() {
        for item_type in ["rune", "moonstone"] {
            let spec = lookup(item_type).expect("on the price list");
            assert_eq!((spec.insurance_value, spec.base_premium), (250, 25));
            assert!(spec.is_component);
        }
    }

    #[test]
    fn a_broomstick_is_not_on_the_price_list() {
        assert_eq!(lookup("broomstick"), None);
    }
}
