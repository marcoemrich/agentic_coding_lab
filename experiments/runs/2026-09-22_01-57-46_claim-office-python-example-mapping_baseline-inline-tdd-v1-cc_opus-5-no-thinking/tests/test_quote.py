from quote import policy_base_premium, quote_premium


def customer(years=0, previous_contracts=0):
    return {"yearsWithMHPCO": years, "previousContracts": previous_contracts}


def item(type_, **fields):
    return {"type": type_, **fields}


def runes(count):
    return [item("rune") for _ in range(count)]


def test_empty_item_list_costs_only_the_processing_fee():
    assert quote_premium(customer(), []) == 5


def test_each_main_item_type_has_its_own_base_premium():
    premiums = {
        t: policy_base_premium([item(t)])
        for t in ("sword", "amulet", "staff", "potion")
    }
    assert premiums == {"sword": 100, "amulet": 60, "staff": 80, "potion": 40}


def test_base_premiums_of_several_items_add_up():
    assert policy_base_premium([item("sword"), item("amulet")]) == 160


def test_components_cost_25_each_without_a_block():
    assert policy_base_premium(runes(2)) == 50


def test_exactly_three_alike_components_form_a_cheaper_block():
    assert policy_base_premium(runes(3)) == 60


def test_four_alike_components_do_not_form_a_block():
    assert policy_base_premium(runes(4)) == 100


def test_seven_alike_components_form_no_block_either():
    assert policy_base_premium(runes(7)) == 175


def test_components_of_different_types_do_not_form_a_block():
    assert policy_base_premium([*runes(2), item("moonstone")]) == 75


def test_each_component_type_forms_its_own_block():
    items = [*runes(3), *(item("moonstone") for _ in range(3))]
    assert policy_base_premium(items) == 120
