"""Rounding, always in the MHPCO's favour."""

import math


def round_in_favour_of_office(premium):
    """Premiums are rounded up."""
    return math.ceil(premium)


def round_in_favour_of_customer(payout):
    """Payouts are rounded down."""
    return math.floor(payout)
