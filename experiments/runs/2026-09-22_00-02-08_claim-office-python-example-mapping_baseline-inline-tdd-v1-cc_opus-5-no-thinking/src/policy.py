"""A policy created by a quote step: what is insured, and how much cap is left."""

from catalogue import insurance_value

CAP_MULTIPLIER = 2


def insurance_sum(items):
    return sum(insurance_value(item["type"]) for item in items)


def payout_cap(items):
    return CAP_MULTIPLIER * insurance_sum(items)
