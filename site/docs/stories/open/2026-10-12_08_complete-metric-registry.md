# Complete the metric registry

Status: open
Source: [site data export](../done/2026-10-11_05_site-data-export.md), 2026-10-12.

## Story

The site data export stops when a declared outcome has no entry in `experiments/metrics-registry.yaml`. The registry has 32 entries; the main RQs declare 51 more in 44 of 46 RQs, among them `refactorings_applied` (28 RQs), `cognitive_avg` (27), `tests_total` (24), `cycle_count` (22), `median_loc_per_function` (18) and `lines_of_code` (17). Each needs a group, a direction (`higher`, `lower` or `informative`) and, where it applies, a scale and comparability flags. Superseded discipline outcomes (`cycle_count`, `refactorings_applied`, …) may instead be dropped from the RQs that declare them. The direction decides trophies, so it is a domain decision, not a lookup.

## Example Mapping

Pending interview with the domain expert. Rules, concrete input/output examples, boundary cases and open questions have not yet been mapped.
