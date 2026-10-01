//! Item catalogue: insurance values and base premiums from the MHPCO price list.

/// An item's catalogue entry.
pub struct Catalogued {
    pub insurance_value: i64,
    pub base_premium: i64,
}

/// Looks up `item_type` in the MHPCO price list, or `None` if unknown.
pub fn lookup(item_type: &str) -> Option<Catalogued> {
    let (insurance_value, base_premium) = match item_type {
        "sword" => (1000, 100),
        "amulet" => (600, 60),
        "staff" => (800, 80),
        "potion" => (400, 40),
        "rune" | "moonstone" => (250, 25),
        _ => return None,
    };
    Some(Catalogued {
        insurance_value,
        base_premium,
    })
}

/// Base premium for `count` alike components of one type.
///
/// A building block of exactly 3 alike components costs 60 G instead of 75 G.
/// The block requires exactly 3: 4 runes cost 100 G and 7 runes cost 175 G,
/// so a larger pile earns no partial-block discount.
pub fn component_block_premium(count: i64) -> i64 {
    const BLOCK_SIZE: i64 = 3;
    const BLOCK_PREMIUM: i64 = 60;
    const PER_COMPONENT: i64 = 25;
    if count == BLOCK_SIZE {
        BLOCK_PREMIUM
    } else {
        count * PER_COMPONENT
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn main_items_follow_the_price_list() {
        for (item_type, value, premium) in [
            ("amulet", 600, 60),
            ("staff", 800, 80),
            ("potion", 400, 40),
        ] {
            let c = lookup(item_type).expect("item is in the price list");
            assert_eq!((c.insurance_value, c.base_premium), (value, premium));
        }
    }

    #[test]
    fn components_are_250_g_insured_for_25_g() {
        for item_type in ["rune", "moonstone"] {
            let c = lookup(item_type).expect("component is in the price list");
            assert_eq!((c.insurance_value, c.base_premium), (250, 25));
        }
    }

    #[test]
    fn a_block_of_three_alike_components_is_cheaper() {
        assert_eq!(component_block_premium(2), 50);
        assert_eq!(component_block_premium(3), 60);
    }

    #[test]
    fn a_pile_other_than_exactly_three_pays_full_price() {
        assert_eq!(component_block_premium(4), 100);
        assert_eq!(component_block_premium(7), 175);
        assert_eq!(component_block_premium(0), 0);
    }

    #[test]
    fn an_unknown_type_is_not_in_the_price_list() {
        assert!(lookup("broomstick").is_none());
    }

    #[test]
    fn sword_is_1000_g_insured_for_100_g() {
        let c = lookup("sword").expect("sword is in the price list");
        assert_eq!((c.insurance_value, c.base_premium), (1000, 100));
    }
}
