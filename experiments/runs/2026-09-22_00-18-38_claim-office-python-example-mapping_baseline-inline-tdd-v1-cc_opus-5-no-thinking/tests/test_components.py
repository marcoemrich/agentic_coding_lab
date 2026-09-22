from fractions import Fraction

from test_quote import premium


def runes(count):
    return [{"type": "rune"} for _ in range(count)]


def expected_premium_for_base(base):
    """The premium the MHPCO charges for a plain policy with this base."""
    with_surcharge = Fraction(base) * Fraction(11, 10)
    return -(-with_surcharge.numerator // with_surcharge.denominator) + 5


def test_two_runes_have_no_block_discount():
    assert premium(runes(2)) == expected_premium_for_base(50)


def test_three_runes_form_a_block():
    assert premium(runes(3)) == expected_premium_for_base(60)


def test_four_runes_do_not_form_a_block():
    assert premium(runes(4)) == expected_premium_for_base(100)


def test_seven_runes_form_no_block_either():
    assert premium(runes(7)) == expected_premium_for_base(175)


def test_alike_means_the_same_type_not_the_same_family():
    items = [*runes(2), {"type": "moonstone"}]
    assert premium(items) == expected_premium_for_base(75)


def test_two_types_each_form_their_own_block():
    moonstones = [{"type": "moonstone"} for _ in range(3)]
    assert premium(runes(3) + moonstones) == expected_premium_for_base(120)
