//! The MHPCO price list: insurance values and base premiums per item type.

/// Base premium in G for a single item of a known type, `None` for anything
/// the price list does not cover. Components share one flat rate.
pub fn base_premium(item_type: &str) -> Option<u64> {
    match item_type {
        "sword" => Some(100),
        "amulet" => Some(60),
        "staff" => Some(80),
        "potion" => Some(40),
        _ if is_component(item_type) => Some(25),
        _ => None,
    }
}

/// Insurance value in G for a known item type, `None` otherwise.
pub fn insurance_value(item_type: &str) -> Option<u64> {
    match item_type {
        "sword" => Some(1000),
        "amulet" => Some(600),
        "staff" => Some(800),
        "potion" => Some(400),
        _ if is_component(item_type) => Some(250),
        _ => None,
    }
}

/// Components are the small parts a main item is built from.
pub fn is_component(item_type: &str) -> bool {
    matches!(item_type, "rune" | "moonstone")
}
