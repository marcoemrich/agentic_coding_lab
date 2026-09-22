from policy import Policy

from test_quote import customer, item


def claim_on(items, *damages, cause="dragon attack"):
    policy = Policy(customer(), items)
    return policy.claim({"cause": cause, "damages": list(damages)})


def damage(item_type, amount):
    return {"itemType": item_type, "amount": amount}


def test_ordinary_damage_is_reimbursed_minus_the_deductible():
    sword = item("sword", material="steel", enchantment=3)
    assert claim_on([sword], damage("sword", 500)).payout == 400


def test_damage_to_a_component_is_reimbursed_minus_the_deductible():
    assert claim_on([item("rune")], damage("rune", 200)).payout == 100


def test_high_enchantment_halves_the_damage_before_the_deductible():
    sword = item("sword", material="steel", enchantment=9)
    assert claim_on([sword], damage("sword", 1000)).payout == 400


def test_enchantment_of_eight_already_halves_the_damage():
    sword = item("sword", material="dragon", enchantment=8)
    assert claim_on([sword], damage("sword", 1000)).payout == 400


def test_dragon_material_alone_is_fully_reimbursed():
    sword = item("sword", material="dragon", enchantment=5)
    assert claim_on([sword], damage("sword", 800)).payout == 700


def test_the_halving_rule_wins_over_dragon_material():
    sword = item("sword", material="dragon", enchantment=9)
    assert claim_on([sword], damage("sword", 1000)).payout == 400


def test_the_deductible_applies_once_per_damaged_item():
    items = [item("sword"), item("amulet")]
    result = claim_on(items, damage("sword", 500), damage("amulet", 300))
    assert result.payout == 600


def test_damage_below_the_deductible_pays_nothing():
    assert claim_on([item("sword")], damage("sword", 80)).payout == 0
