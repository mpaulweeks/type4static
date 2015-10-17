import json
import sys

import add_category
import parse_oracle


def main(new_category, keyword):
    add_category.main(new_category)
    names = parse_oracle.main(keyword)

    with open("json/stack/current.json") as current_file:
        current = json.load(current_file)

    for card in current["card"]:
        if card["name"].lower() in names:
            card[new_category] = True

    with open("json/stack/current.json", "w") as current_file:
        json.dump(current, current_file)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print "this script takes exactly two args: category name and keyword"
    else:
        new_category = sys.argv[1]
        keyword = sys.argv[2]
        main(new_category, keyword)
