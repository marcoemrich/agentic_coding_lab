//! Transport adapter: the JSON scenario documents the CLI exchanges, and the
//! step-by-step processing that turns them into results.

use serde::{Deserialize, Serialize};

use crate::{
    ContractNumber, Customer, Damage, Incident, Item, ItemType, Material, Policy, claim, quote,
};

#[derive(Deserialize)]
struct ScenarioDocument {
    customer: CustomerDocument,
    steps: Vec<StepDocument>,
}

#[derive(Deserialize)]
struct CustomerDocument {
    #[serde(rename = "yearsWithMHPCO")]
    years_with_mhpco: u32,
}

#[derive(Deserialize)]
#[serde(tag = "op")]
enum StepDocument {
    #[serde(rename = "quote")]
    Quote { items: Vec<ItemDocument> },
    #[serde(rename = "claim")]
    Claim {
        policy: usize,
        incident: IncidentDocument,
    },
}

#[derive(Deserialize)]
struct ItemDocument {
    r#type: String,
    material: Option<String>,
    enchantment: Option<u32>,
    #[serde(default)]
    cursed: bool,
}

#[derive(Deserialize)]
struct IncidentDocument {
    #[allow(dead_code)]
    cause: String,
    damages: Vec<DamageDocument>,
}

#[derive(Deserialize)]
struct DamageDocument {
    #[serde(rename = "itemType")]
    item_type: String,
    amount: i64,
}

#[derive(Serialize)]
#[serde(untagged)]
enum ResultDocument {
    Quote {
        premium: u64,
    },
    Claim {
        payout: u64,
        #[serde(rename = "remainingCap")]
        remaining_cap: u64,
    },
}

#[derive(Serialize)]
struct ResultsDocument {
    results: Vec<ResultDocument>,
}

impl ItemDocument {
    fn to_item(&self) -> Result<Item, String> {
        Ok(Item {
            item_type: ItemType::parse(&self.r#type)?,
            cursed: self.cursed,
            enchantment: self.enchantment,
            material: self.material.as_deref().map(Material::parse),
        })
    }
}

impl IncidentDocument {
    fn to_incident(&self) -> Result<Incident, String> {
        Ok(Incident {
            damages: self
                .damages
                .iter()
                .map(DamageDocument::to_damage)
                .collect::<Result<_, _>>()?,
        })
    }
}

impl DamageDocument {
    fn to_damage(&self) -> Result<Damage, String> {
        Ok(Damage {
            item_type: ItemType::parse(&self.item_type)?,
            amount: self.amount,
        })
    }
}

/// One customer's dealings with the MHPCO, step by step: every quote issues a
/// policy a later claim can be settled against.
struct Scenario {
    customer: Customer,
    /// The policy each step issued, by step index; a claim step issues none.
    policies: Vec<Option<Policy>>,
}

impl Scenario {
    fn new(customer: Customer) -> Self {
        Scenario {
            customer,
            policies: Vec::new(),
        }
    }

    /// Every contract after the customer's first earns the follow-up discount.
    fn contract_number(&self) -> ContractNumber {
        if self.policies.iter().any(Option::is_some) {
            ContractNumber::FollowUp
        } else {
            ContractNumber::First
        }
    }

    fn run_quote(&mut self, items: &[Item]) -> Result<ResultDocument, String> {
        let policy = quote(&self.customer, items, self.contract_number())?;
        let premium = policy.premium;
        self.policies.push(Some(policy));

        Ok(ResultDocument::Quote { premium })
    }

    fn run_claim(&mut self, step: usize, incident: &Incident) -> Result<ResultDocument, String> {
        let policy = self
            .policies
            .get_mut(step)
            .and_then(Option::as_mut)
            .ok_or_else(|| format!("no policy was created by step {step}"))?;
        let settlement = claim(policy, incident)?;
        self.policies.push(None);

        Ok(ResultDocument::Claim {
            payout: settlement.payout,
            remaining_cap: settlement.remaining_cap,
        })
    }

    fn run_step(&mut self, step: &StepDocument) -> Result<ResultDocument, String> {
        match step {
            StepDocument::Quote { items } => {
                let items: Vec<Item> = items
                    .iter()
                    .map(ItemDocument::to_item)
                    .collect::<Result<_, _>>()?;
                self.run_quote(&items)
            }
            StepDocument::Claim { policy, incident } => {
                let incident = incident.to_incident()?;
                self.run_claim(*policy, &incident)
            }
        }
    }
}

/// Runs a scenario document end to end and renders its results document.
pub fn run_scenario(scenario: &str) -> Result<String, String> {
    let document: ScenarioDocument =
        serde_json::from_str(scenario).map_err(|error| format!("malformed scenario: {error}"))?;
    let mut run = Scenario::new(Customer {
        years_with_mhpco: document.customer.years_with_mhpco,
    });

    let results = document
        .steps
        .iter()
        .map(|step| run.run_step(step))
        .collect::<Result<Vec<_>, _>>()?;

    serde_json::to_string(&ResultsDocument { results })
        .map_err(|error| format!("failed to render the results: {error}"))
}
