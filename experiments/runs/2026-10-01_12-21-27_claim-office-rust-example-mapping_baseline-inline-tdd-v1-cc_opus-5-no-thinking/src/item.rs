//! The items a policy covers, as parsed from a quote step.

use serde::Deserialize;

/// One insured item. `material`, `enchantment` and `cursed` are absent for
/// components such as runes, which carry no enchantment level or material.
#[derive(Debug, Clone, Deserialize)]
pub struct Item {
    #[serde(rename = "type")]
    pub item_type: String,
    #[serde(default)]
    pub material: Option<String>,
    #[serde(default)]
    pub enchantment: Option<i64>,
    #[serde(default)]
    pub cursed: bool,
}

impl Item {
    /// Whether this item is a component, which is priced in blocks of 3.
    pub fn is_component(&self) -> bool {
        matches!(self.item_type.as_str(), "rune" | "moonstone")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn parse(json: &str) -> Item {
        serde_json::from_str(json).expect("item parses")
    }

    #[test]
    fn a_full_item_parses_every_field() {
        let item = parse(r#"{"type":"sword","material":"steel","enchantment":3,"cursed":true}"#);
        assert_eq!(item.item_type, "sword");
        assert_eq!(item.material.as_deref(), Some("steel"));
        assert_eq!(item.enchantment, Some(3));
        assert!(item.cursed);
    }

    #[test]
    fn a_component_parses_without_material_or_enchantment() {
        let item = parse(r#"{"type":"rune"}"#);
        assert_eq!(item.enchantment, None);
        assert_eq!(item.material, None);
        assert!(!item.cursed);
        assert!(item.is_component());
    }

    #[test]
    fn a_sword_is_not_a_component() {
        assert!(!parse(r#"{"type":"sword"}"#).is_component());
    }
}
