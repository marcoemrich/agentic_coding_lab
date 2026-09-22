"""The MHPCO's policy management rules for quoting and claiming."""

import math
from collections import Counter
from dataclasses import dataclass, replace
from enum import Enum

PROCESSING_FEE = 5

BLOCK_SIZE = 3

BLOCK_BASE_PREMIUM = 60

CURSE_SURCHARGE_RATE = 0.5

HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3

HIGH_ENCHANTMENT_SURCHARGE_LEVEL = 5

LOYALTY_DISCOUNT_RATE = 0.2

LOYALTY_YEARS = 2

FIRST_INSURANCE_SURCHARGE_RATE = 0.1

FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15

DEDUCTIBLE_PER_DAMAGE = 100

HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5

LIMITED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8

CAP_MULTIPLE_OF_INSURANCE_SUM = 2


@dataclass(frozen=True)
class PriceListEntry:
    """What the MHPCO price list states about one type of insurable item.

    The office quotes and settles from a single price list, and it lists two
    figures against each item type it will insure: the insurance value it would
    have to make good, and the base premium it charges to carry that risk. The
    two are read on opposite sides of the business — one values a policy, the
    other prices it — but they are one entry in one list, so the set of item
    types the MHPCO insures is recorded once.
    """

    insurance_value: int
    base_premium: int


PRICE_LIST = {
    "sword": PriceListEntry(insurance_value=1000, base_premium=100),
    "amulet": PriceListEntry(insurance_value=600, base_premium=60),
    "staff": PriceListEntry(insurance_value=800, base_premium=80),
    "potion": PriceListEntry(insurance_value=400, base_premium=40),
    "rune": PriceListEntry(insurance_value=250, base_premium=25),
    "moonstone": PriceListEntry(insurance_value=250, base_premium=25),
}


@dataclass(frozen=True)
class CustomerStanding:
    """How a customer stands with the MHPCO at one point in a scenario.

    The office reads a customer's standing from two facts it keeps on file: how
    long they have brought it business, and how many contracts they already hold.
    Both earn modifiers, and both are properties of the customer rather than of
    the items being quoted, so they travel together as one concept.
    """

    years_with_mhpco: int
    contracts_so_far: int = 0

    @classmethod
    def on_file_for(cls, customer):
        """Read the standing the MHPCO has on file for a scenario's customer."""
        return cls(years_with_mhpco=customer["yearsWithMHPCO"])

    def is_long_standing(self):
        """Decide whether the customer has brought the MHPCO business long enough."""
        return self.years_with_mhpco >= LOYALTY_YEARS

    def is_follow_up_contract(self):
        """Decide whether the contract being quoted follows an earlier one."""
        return self.contracts_so_far > 0

    def with_one_more_contract(self):
        """Advance the standing to reflect one further contract with the office."""
        return replace(self, contracts_so_far=self.contracts_so_far + 1)


@dataclass
class PolicyRegister:
    """The policies the MHPCO has written over the course of one scenario.

    The office files each policy under the quote that created it, because that
    is how a later claim names the policy it is made against: by the zero-based
    index of its quote step. Keeping that filing is this register's whole
    business, and it is kept in one vocabulary -- a quote step of the scenario
    -- on both sides, so nothing that files or retrieves a policy has to know
    how the filing itself is arranged. Reading which policy a claim form names
    belongs to whoever reads the form, not here.
    """

    policies_by_quote_step: dict

    @classmethod
    def empty(cls):
        """Open an empty register for a scenario in which nothing is yet insured."""
        return cls(policies_by_quote_step={})

    def file(self, quote_step, policy):
        """File a newly written policy under the quote step that created it."""
        self.policies_by_quote_step[quote_step] = policy

    def policy_filed_under(self, quote_step):
        """Retrieve the policy on file under one quote step of the scenario."""
        return self.policies_by_quote_step[quote_step]


def run_scenario(scenario):
    """Work through a scenario's steps in order, reporting what the office decides.

    The office reads one customer's file for the whole scenario and carries two
    things forward as it works: the customer's standing, which the steps that
    take out a contract advance, and the register of policies it has written,
    which each claim is settled against. Reporting a decision and advancing the
    customer's standing are separate readings of a step, so each step is asked
    both questions rather than one answer being inferred from the other.
    """
    standing = CustomerStanding.on_file_for(scenario["customer"])
    register = PolicyRegister.empty()
    results = []
    for index, step in enumerate(scenario["steps"]):
        if is_a_quote(step):
            results.append(quote(step["items"], standing))
            register.file(index, Policy.covering(step["items"]))
        else:
            policy = register.policy_filed_under(step["policy"])
            results.append(policy.settle(step["incident"]))
        if takes_out_a_contract(step):
            standing = standing.with_one_more_contract()
    return {"results": results}


def is_a_quote(step):
    """Decide whether a step asks the MHPCO to quote a policy."""
    return step["op"] == "quote"


def takes_out_a_contract(step):
    """Decide whether a step leaves the customer holding one more contract.

    The MHPCO's follow-up discount counts a customer's contracts with the
    office, and only a quote takes one out: a claim is made against a contract
    the customer already holds, so settling it leaves their standing where it
    was. A customer who quotes, claims, and quotes again is on their second
    contract at the second quote, not their third.
    """
    return is_a_quote(step)


@dataclass(frozen=True)
class InsuredSchedule:
    """The schedule of items a policy covers, as the MHPCO wrote it down.

    A claim names the item it concerns by type and nothing more, so the office
    reads a damage report against this schedule to learn which insured item is
    meant. Which damages the schedule admits, and which insured item each one
    answers to, is its own clause: it is read from the items alone and is
    settled before any question of money arises.
    """

    insured_items: list

    @classmethod
    def of(cls, items):
        """Write down the schedule of items a policy is to cover."""
        return cls(insured_items=list(items))

    def insurance_sum(self):
        """Value what the schedule insures: the insurance value of every item on it.

        Each item is valued in its own right and the values are totalled, so a
        customer who brings two swords is insured for two swords' worth. This is
        a valuation of the scheduled items themselves: the price list's
        insurance value is what the office would have to make good, and no
        premium clause touches it. The schedule is what the policy covers, so
        the schedule is also what answers how much cover it amounts to.
        """
        return sum(
            item_insurance_value(item["type"]) for item in self.insured_items
        )

    def read_damages_against_items(self, damages):
        """Pair every damage in a claim with the distinct insured item it concerns.

        Each insured item answers at most one damage, so the schedule reads
        the claim against the items it has not yet answered with: a claim
        naming a type more often than the policy covers it claims for an item
        the office never insured, and the MHPCO rejects such a claim whole
        rather than settling the part it recognises.

        The schedule hands back each damage already paired with the item it
        answers to, because which item a damage concerns is the schedule's
        reading and nobody else's: a caller given two parallel lists would have
        to re-establish that pairing to use either.
        """
        unanswered = list(self.insured_items)
        return [
            (damage, self._strike_off_item_answering(damage, unanswered))
            for damage in damages
        ]

    def _strike_off_item_answering(self, damage, unanswered_items):
        """Name the insured item a damage answers to, striking it off the rest.

        One reading step of the schedule's matching clause, not a question the
        office answers on its own: the schedule takes the first item still
        unanswered that answers the damage and strikes it off, so a later
        damage cannot claim the same item again.

        A damage that no remaining item answers names something the policy does
        not cover, and the office refuses the claim rather than reading past
        it. The office reaches that refusal by one reading but from two
        directions, and its terms name both: the policy may cover no item of
        the named type at all -- an amulet damaged when only a sword is
        insured -- or it may cover fewer than the claim names, a second sword
        damage against a single insured sword. Either way the damage claims for
        an item the MHPCO never insured, so neither is the lesser fault and the
        whole claim is rejected rather than the recognised part settled.
        """
        for index, item in enumerate(unanswered_items):
            if answers_damage(item, damage):
                return unanswered_items.pop(index)
        raise ValueError(
            "the policy does not cover an unclaimed item of type "
            f"{damage['itemType']!r}"
        )


def answers_damage(insured_item, damage):
    """Decide whether this insured item is the one a damage report concerns.

    A damage names the item it concerns by type and nothing more -- the claim
    form gives the office no other handle on it -- so the office reads a damage
    against an insured item by type alone. An item type the price list does not
    carry answers no insured item at all, which is why a 'broomstick' damage
    finds nothing on any schedule the office could have written.
    """
    return insured_item["type"] == damage["itemType"]


@dataclass
class Policy:
    """A policy the MHPCO has written over a customer's items.

    The office remembers how much of the policy's cap it has not yet paid out,
    because the cap is exhausted across successive claims. What the policy
    insures is valued once, when the policy is written, and thereafter the
    office needs the cap that valuation earned and the schedule a claim is read
    against.
    """

    insured_schedule: InsuredSchedule
    remaining_cap: int

    @classmethod
    def covering(cls, items):
        """Write a policy over the given items, capped in the MHPCO's terms."""
        insured_schedule = InsuredSchedule.of(items)
        return cls(
            insured_schedule=insured_schedule,
            remaining_cap=cap_for(insured_schedule.insurance_sum()),
        )

    def settle(self, incident):
        """Report what the MHPCO pays out for an incident and what cap is left.

        The office settles a claim in two readings it keeps apart: what its
        reimbursement clauses owe for the incident, and how much of that its
        lifetime cap will actually release. Only what the cap releases is paid
        out, and the policy draws that amount down before reporting.
        """
        payout = LedgerSide.OWED_BY_MHPCO.rounded_in_mhpco_favour(
            self.cap_released_for(self.total_reimbursement_for(incident))
        )
        self.remaining_cap -= payout
        return {"payout": payout, "remainingCap": self.remaining_cap}

    def cap_released_for(self, desired_payout):
        """Decide how much of a desired payout the policy's cap will release.

        The MHPCO caps what it pays out over a policy's whole lifetime, so a
        claim is never settled for more than the cap has left: a desired payout
        beyond it is reduced to the remainder, and the office owes nothing
        further on that policy. This is the cap's own clause, read separately
        from the reimbursement clauses that decide what the incident is worth.
        """
        return min(desired_payout, self.remaining_cap)

    def total_reimbursement_for(self, incident):
        """Total what the MHPCO owes for every item an incident damaged.

        An incident is settled damage by damage rather than as one loss, because
        the MHPCO's deductible is charged per damaged item: two items lost to one
        dragon attack are two damages, each bearing its own deductible.
        """
        return sum(
            reimbursement_for(damage, item)
            for damage, item in self.insured_schedule.read_damages_against_items(
                incident["damages"]
            )
        )


def cap_for(insurance_sum):
    """Cap what the MHPCO will pay out over a policy's whole lifetime."""
    return CAP_MULTIPLE_OF_INSURANCE_SUM * insurance_sum


def reimbursement_for(damage, item):
    """Charge the MHPCO's deductible against what a damage is reimbursable for.

    The office settles a damage in three steps, and their order is part of the
    terms: it first satisfies itself that the report describes a loss it could
    make good at all, then reads what its reimbursement clauses allow for the
    damage, and only then charges the deductible against that amount. A
    deductible that exceeds the reimbursable amount does not turn into money
    owed by the customer, so the charge stops at nothing owed.
    """
    refuse_unless_a_loss_is_reported(damage)
    return max(0, reimbursable_amount_for(damage, item) - DEDUCTIBLE_PER_DAMAGE)


def refuse_unless_a_loss_is_reported(damage):
    """Satisfy the office that a damage report describes a loss at all.

    A loss is an amount the MHPCO might make good, so a report of a negative
    amount describes no loss at all. The office declines to entertain such a
    claim rather than reading it as nothing lost. This is a question of whether
    the report is admissible, asked and answered before any reimbursement
    clause is read against it: what the office will entertain and what it will
    pay for are separate terms, and neither moves the other.
    """
    amount = damage["amount"]
    if amount < 0:
        raise ValueError(f"a damage cannot amount to less than nothing: {amount}")


def reimbursable_amount_for(damage, item):
    """Read how much of a damage the MHPCO's reimbursement clauses allow.

    Absent any special clause, the office reimburses a damage in full: the
    reported amount is what it stands to make good, before the deductible.

    The MHPCO's terms name a second clause here that this reading deliberately
    leaves unwritten: damage to an item of dragon material is fully
    reimbursed. Full reimbursement is already what the office allows absent
    any clause, and where the dragon clause meets the high-enchantment limit
    the office's own precedence has the 50 % limit win. So the clause grants
    exactly the default whenever it stands alone, and is overridden whenever
    it does not -- it cannot move a settlement either way, and every one of
    the office's dragon-material examples settles correctly without it. The
    clause would start to earn code the moment a term reduced the default
    below full reimbursement, because then it would have something to
    override.
    """
    reported_amount = damage["amount"]
    if is_too_enchanted_to_reimburse_in_full(item):
        return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE * reported_amount
    return reported_amount


def is_too_enchanted_to_reimburse_in_full(item):
    """Decide whether an item's enchantment limits what the MHPCO will reimburse.

    This is the claim side's own reading of enchantment, and it is a stricter
    one than the premium side's: the office will carry a moderately enchanted
    item at a surcharge, but past this level it considers the magic too
    volatile to make good in full. The two thresholds answer to different
    clauses and move independently of each other.
    """
    return enchantment_level_of(item) >= LIMITED_REIMBURSEMENT_ENCHANTMENT_LEVEL


def quote(items, standing):
    """Report the result of quoting a policy over the given items."""
    return {"premium": premium_for(items, standing)}


def premium_for(items, standing):
    """Compute the premium the MHPCO charges for insuring the given items.

    The office settles what the risk is worth first and only then adds its
    processing fee: the fee is charged at the very end, after every modifier,
    so it is never itself discounted or surcharged by any clause.
    """
    return LedgerSide.OWED_TO_MHPCO.rounded_in_mhpco_favour(
        modified_risk_premium(items, standing) + PROCESSING_FEE
    )


class LedgerSide(Enum):
    """The side of the MHPCO's ledger a settled amount sits on.

    The office has one rounding convention -- it always rounds in its own
    favour -- but that convention only becomes a direction once the office
    knows who owes whom. Money owed *to* the MHPCO is stated as the whole G it
    is willing to invoice, and money owed *by* it as the whole G it is willing
    to pay; favour points up on the one side and down on the other. Which side
    an amount sits on is what the office reads first, and it is what the
    convention is read against, so the two are recorded here together.
    """

    OWED_TO_MHPCO = math.ceil
    OWED_BY_MHPCO = math.floor

    def rounded_in_mhpco_favour(self, settled_amount):
        """State a settled amount as the whole G the MHPCO's favour allows.

        Only a settled total is rounded; the amounts measured along the way to
        it are kept as fractions, because rounding each in the office's favour
        would charge its favour over and over against one settlement.
        """
        return self.value(settled_amount)


def modified_risk_premium(items, standing):
    """Value the insured risk: the policy base premium with every modifier applied.

    This is what the MHPCO thinks the items are worth insuring, once the
    item-specific risk clauses and the whole-policy clauses have been measured
    against the base premium. It carries no administrative charge.
    """
    base = policy_base_premium(items)
    return base + item_risk_surcharges(items) + policy_wide_modifiers(base, standing)


def policy_wide_modifiers(policy_base, standing):
    """Total the modifiers the MHPCO measures against the policy base premium.

    The office draws a line between clauses it charges against a single item's
    own base premium and clauses it charges against the policy as a whole. This
    is the whole-policy side of that line: every clause here is a percentage of
    the same amount, and they are totalled as signed amounts, a discount
    counting against the premium and a surcharge towards it.
    """
    return first_insurance_surcharge(policy_base) + customer_history_modifiers(
        policy_base, standing
    )


def first_insurance_surcharge(policy_base):
    """Charge the MHPCO's initial assessment against the policy base premium.

    The MHPCO assesses every quote it is handed as a first insurance, whatever
    the customer's history with the office: a long-standing customer's new
    sword is still a sword the office has never appraised. The surcharge is
    therefore unconditional, and no customer attribute can waive it.
    """
    return FIRST_INSURANCE_SURCHARGE_RATE * policy_base


def customer_history_modifiers(policy_base, standing):
    """Total the modifiers the customer's standing with the MHPCO earns them.

    These are the whole-policy clauses the office grants or withholds by
    reading the customer's file rather than the items being insured. Each is
    granted on its own reading of the file, so a customer who satisfies
    several of them earns every one.
    """
    return loyalty_discount(policy_base, standing) + follow_up_contract_discount(
        policy_base, standing
    )


def loyalty_discount(policy_base, standing):
    """Grant the discount the MHPCO owes a customer for their years of business."""
    if not standing.is_long_standing():
        return 0
    return -LOYALTY_DISCOUNT_RATE * policy_base


def follow_up_contract_discount(policy_base, standing):
    """Grant the discount the MHPCO offers on every contract after a customer's first."""
    if not standing.is_follow_up_contract():
        return 0
    return -FOLLOW_UP_CONTRACT_DISCOUNT_RATE * policy_base


def policy_base_premium(items):
    """Sum the base premiums of a policy's alike-item groups.

    The MHPCO's policy base premium is the sum of all item base premiums alone;
    item-specific surcharges are added on top of it, and policy-wide modifiers
    are measured against it.
    """
    return sum(
        alike_items_base_premium(item_type, count)
        for item_type, count in alike_item_groups(items).items()
    )


def item_risk_surcharges(items):
    """Add up the risk surcharges the policy's individual items carry."""
    return sum(item_risk_surcharge(item) for item in items)


def item_risk_surcharge(item):
    """Add up the risk surcharges this item's own attributes carry.

    Each of the MHPCO's risk clauses is charged in its own right against the
    item's base premium, so an item that triggers several clauses carries
    every one of their surcharges.
    """
    base_premium = item_base_premium(item["type"])
    surcharge = 0
    if is_cursed(item):
        surcharge += CURSE_SURCHARGE_RATE * base_premium
    if is_highly_enchanted_for_surcharge(item):
        surcharge += HIGH_ENCHANTMENT_SURCHARGE_RATE * base_premium
    return surcharge


def is_cursed(item):
    """Decide whether the MHPCO regards the item as cursed."""
    return bool(item.get("cursed"))


def is_highly_enchanted_for_surcharge(item):
    """Decide whether an item's enchantment makes it riskier for the MHPCO to carry.

    This is the premium side's reading of enchantment, which the office sets
    lower than the claim side's: enchantment this high earns a surcharge but
    still buys full reimbursement. The two thresholds answer to different
    clauses and move independently of each other.
    """
    return enchantment_level_of(item) >= HIGH_ENCHANTMENT_SURCHARGE_LEVEL


def enchantment_level_of(item):
    """Read how highly enchanted the MHPCO takes an item to be.

    Both of the office's enchantment clauses -- the premium surcharge and the
    claim-side reimbursement limit -- are read against this one level, and each
    sets its own threshold against it. An item whose description states no
    enchantment level, as components such as runes and moonstones do not, is
    read as carrying no enchantment at all rather than as unappraised.
    """
    return item.get("enchantment", 0)


def alike_item_groups(items):
    """Group a policy's items by what makes them alike, counting each group.

    The MHPCO reads "alike" as the same item type, not merely a related family:
    2 runes and 1 moonstone are three items of two types and form no block.
    """
    return Counter(item["type"] for item in items)


def alike_items_base_premium(item_type, count):
    """Price one group of alike items, as a building block when they form one."""
    if forms_a_building_block(count):
        return BLOCK_BASE_PREMIUM
    return count * item_base_premium(item_type)


def item_insurance_value(item_type):
    """Look up the MHPCO price list's insurance value for one item of this type."""
    return price_list_entry_for(item_type).insurance_value


def item_base_premium(item_type):
    """Look up the MHPCO price list's base premium for one item of this type."""
    return price_list_entry_for(item_type).base_premium


def price_list_entry_for(item_type):
    """Find what the MHPCO price list states about this type of item.

    The office insures only what its price list carries: an item of any other
    type has no insurance value and no base premium it could quote, so it
    declines the business rather than guessing a figure.
    """
    entry = PRICE_LIST.get(item_type)
    if entry is None:
        raise ValueError(
            f"the MHPCO price list does not carry items of type {item_type!r}"
        )
    return entry


def forms_a_building_block(count):
    """Decide whether this many alike items are offered as a building block.

    The MHPCO grants the block to any alike items, not only to components:
    no example distinguishes a block of components from a block of main items.
    """
    return count == BLOCK_SIZE
