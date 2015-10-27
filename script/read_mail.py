import json
import mailbox

PATH = "script/mail/data.mbox"


def read_email(message):
    content = message.get_payload()[1].get_payload(decode=True)
    image_index = content.index("<img")
    return content[0:image_index]


def main():
    bodies = []
    mbox = mailbox.mbox(PATH)
    for email in mbox:
        body = read_email(email)
        # print body
        # assert False
        bodies.append(body)
    combined = '[%s]' % ",".join(bodies)
    out = json.loads(combined)
    return out

if __name__ == "__main__":
    json_data = main()
    with open("json/mail/raw.json", "w") as json_file:
        json.dump(json_data, json_file)
