//! The MHPCO price list: what each insurable thing is worth and what it costs
//! to insure before any modifier is applied.

/// An item kind from the MHPCO price list.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Kind {
    Sword,
    Amulet,
    Staff,
    Potion,
    /// A component (rune, moonstone, ...). Components of different types are
    /// not "alike", so the variant carries the concrete type name.
    Component(ComponentKind),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub enum ComponentKind {
    Rune,
    Moonstone,
}

impl Kind {
    /// Resolves a `type` string from the CLI input, or `None` for a type the
    /// MHPCO does not cover.
    pub fn parse(name: &str) -> Option<Self> {
        match name {
            "sword" => Some(Self::Sword),
            "amulet" => Some(Self::Amulet),
            "staff" => Some(Self::Staff),
            "potion" => Some(Self::Potion),
            "rune" => Some(Self::Component(ComponentKind::Rune)),
            "moonstone" => Some(Self::Component(ComponentKind::Moonstone)),
            _ => None,
        }
    }

    /// Insurance value in G. Feeds the insurance sum and thus the payout cap.
    pub fn insurance_value(self) -> i64 {
        match self {
            Self::Sword => 1000,
            Self::Amulet => 600,
            Self::Staff => 800,
            Self::Potion => 400,
            Self::Component(_) => 250,
        }
    }

    /// Base premium in G for a single piece, before block discount.
    pub fn base_premium(self) -> i64 {
        match self {
            Self::Sword => 100,
            Self::Amulet => 60,
            Self::Staff => 80,
            Self::Potion => 40,
            Self::Component(_) => 25,
        }
    }

    pub fn component(self) -> Option<ComponentKind> {
        match self {
            Self::Component(kind) => Some(kind),
            _ => None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn price_list_gives_value_and_premium_per_kind() {
        for (name, value, premium) in [
            ("sword", 1000, 100),
            ("amulet", 600, 60),
            ("staff", 800, 80),
            ("potion", 400, 40),
            ("rune", 250, 25),
            ("moonstone", 250, 25),
        ] {
            let kind = Kind::parse(name).expect("known type");
            assert_eq!(kind.insurance_value(), value, "value of {name}");
            assert_eq!(kind.base_premium(), premium, "premium of {name}");
        }
    }

    #[test]
    fn unknown_type_is_not_covered() {
        assert_eq!(Kind::parse("broomstick"), None);
    }

    #[test]
    fn runes_and_moonstones_are_different_component_types() {
        assert_ne!(Kind::parse("rune"), Kind::parse("moonstone"));
    }
}
