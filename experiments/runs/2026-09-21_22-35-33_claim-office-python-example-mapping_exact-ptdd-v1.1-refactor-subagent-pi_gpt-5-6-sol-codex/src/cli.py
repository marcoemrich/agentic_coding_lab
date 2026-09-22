import json
import sys

from claim_office import process_scenario


def main():
    scenario = json.load(sys.stdin)
    result = process_scenario(scenario)
    json.dump(result, sys.stdout)


if __name__ == "__main__":
    main()
