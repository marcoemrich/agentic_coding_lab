from claims import damage_payout


def sword(**kwargs):
    return {"type": "sword", "material": "steel", "enchantment": 3, **kwargs}


def test_standard_reimbursement_is_full_damage_minus_deductible():
    assert damage_payout(sword(), 500) == 400


def test_component_has_no_special_clause():
    assert damage_payout({"type": "rune"}, 200) == 100


def test_high_enchantment_halves_the_damage_before_the_deductible():
    assert damage_payout(sword(enchantment=9), 1000) == 400


def test_high_enchantment_threshold_is_exactly_eight():
    assert damage_payout(sword(enchantment=8), 1000) == 400
    assert damage_payout(sword(enchantment=7), 1000) == 900


def test_dragon_material_is_fully_reimbursed():
    assert damage_payout(sword(material="dragon", enchantment=5), 800) == 700


def test_half_rule_wins_over_dragon_material():
    assert damage_payout(sword(material="dragon", enchantment=9), 1000) == 400


def test_dragon_material_sword_at_exactly_enchantment_eight():
    assert damage_payout(sword(material="dragon", enchantment=8), 1000) == 400


def test_payout_never_goes_below_zero():
    assert damage_payout(sword(), 50) == 0
