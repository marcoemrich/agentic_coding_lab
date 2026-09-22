from quote import quote_premium

from test_quote import customer, item

# A customer of exactly 2 years pays 10 % first insurance minus 20 % loyalty,
# i.e. -10 % of the policy base; these tests use a newcomer (+10 %) instead and
# state the expected premium in full.


def test_a_cursed_item_adds_half_its_base_premium():
    # 100 base + 50 curse + 10 first insurance + 5 fee
    assert quote_premium(customer(), [item("sword", cursed=True)]) == 165


def test_enchantment_of_five_adds_thirty_percent_of_the_base_premium():
    # 100 base + 30 enchantment + 10 first insurance + 5 fee
    assert quote_premium(customer(), [item("sword", enchantment=5)]) == 145


def test_enchantment_of_four_adds_nothing():
    assert quote_premium(customer(), [item("sword", enchantment=4)]) == 115


def test_curse_and_high_enchantment_stack_on_the_same_item():
    sword = item("sword", cursed=True, enchantment=5)
    # 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee
    assert quote_premium(customer(), [sword]) == 195


def test_item_surcharges_apply_only_to_the_affected_item():
    items = [item("sword", cursed=True), item("amulet")]
    # base 160, curse 50 (half of the sword only), first insurance 16, fee 5
    assert quote_premium(customer(), items) == 231
