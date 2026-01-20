import json

USER_FILE = "user.json"

def authenticate(username, password):
    with open(USER_FILE, "r") as f:
        users = json.load(f)

    return users.get(username) == password
