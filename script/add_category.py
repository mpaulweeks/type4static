import json
import sys


def main(new_category):
    with open("json/stack/current.json") as current_file:
        current = json.load(current_file)

    for card in current["card"]:
        card[new_category] = False
    with open("json/stack/current.json", "w") as current_file:
        json.dump(current, current_file)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print "this script takes exactly one arg"
    else:
        new_category = sys.argv[1].lower()
        main(new_category)
