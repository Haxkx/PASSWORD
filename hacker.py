import random
import time
import sys
import os
from ssl import CERT_NONE
from gzip import decompress
from random import choice, choices
from concurrent.futures import ThreadPoolExecutor
from json import dumps

try:
    from websocket import create_connection
except ImportError:
    os.system('pip install websocket-client')
    from websocket import create_connection

PASSWORD = "...xxx..."

# Colors
G = '\033[1;32m'  # Green
R = '\033[1;31m'  # Red
Y = '\033[1;33m'  # Yellow
C = '\033[1;36m'  # Cyan
W = '\033[0m'     # Reset
B = '\033[1;34m'  # Blue
M = '\033[1;35m'  # Magenta

def slowprint(text, delay=0.002):
    for c in text:
        sys.stdout.write(c)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def banner():
    clear_screen()
    art = f"""
{R}███████╗ █████╗ ██████╗ ████████╗ █████╗ ███╗   ██╗
{Y}╚══███╔╝██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗████╗  ██║
{G}  ███╔╝ ███████║██████╔╝   ██║   ███████║██╔██╗ ██║
{C} ███╔╝  ██╔══██║██╔═══╝    ██║   ██╔══██║██║╚██╗██║
{B}███████╗██║  ██║██║        ██║   ██║  ██║██║ ╚████║
{M}╚══════╝╚═╝  ╚═╝╚═╝        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝
{W}               ⚡ VIP AUTO ACCOUNT MAKER ⚡
{Y}           Created By: Captain_Engineer 👑
    """
    print(art)

def password_input():
    banner()
    slowprint(f"{G}[🔐] Enter Password to access: {W}", 0.001)
    try:
        import getpass
        input_pass = getpass.getpass('')
    except ImportError:
        input_pass = input("\033[8m")  # hide input simulation
    print(W)
    if input_pass != PASSWORD:
        print(f"{R}❌ Wrong password. Access Denied.{W}")
        sys.exit()
    slowprint(f"{G}[✔] Access Granted...{W}", 0.3)
    time.sleep(0.5)

def welcome_message():
    banner()
    slowprint(f"{C}[🧠] Welcome, Captain_Engineer! Initializing system...{W}", 0.01)
    time.sleep(1)
    print(f"{M}+{'-'*48}+{W}")
    print(f"{Y}| {'Live Safeum Account Maker Running...':^46} |{W}")
    print(f"{M}+{'-'*48}+{W}\n")

def print_status(success, failed, retry, accounts):
    clear_screen()
    banner()
    print(f"{M}+{'='*48}+{W}")
    print(f"{Y}| {'Live Safeum Account Maker Running...':^46} |{W}")
    print(f"{M}+{'='*48}+{W}")
    print(f"\n{G}[✔] Success: {success}   {R}[✘] Failed: {failed}   {Y}[~] Retry: {retry}{W}\n")
    print(f"{C}--- Live Accounts (Last 10) ---{W}")
    for acc in accounts[-10:]:
        print(f"{G}[LIVE✔] {acc}{W}")
    print(f"\n{M}+{'='*48}+{W}")

def print_success_banner(username):
    print(f"{G}✅ Account Created Successfully! Username: {username}{W}")

def print_fail_banner(username):
    print(f"{R}❌ Account Creation Failed! Username: {username}{W}")

def print_retry_banner(username):
    print(f"{Y}🔄 Retrying Account Creation... Username: {username}{W}")

def work():
    global failed, success, retry, accounts
    username = "Captain" + choice('abcdefghijklmnopqrstuvwxyz') + ''.join(choices('abcdefghijklmnopqrstuvwxyz0123456789', k=13))
    try:
        con = create_connection("wss://193.200.173.45/Auth",
            header={
                "app": "com.safeum.android",
                "host": None,
                "remoteIp": "193.200.173.45",
                "remotePort": str(8080),
                "sessionId": "b6cbb22d-06ca-41ff-8fda-c0ddeb148195",
                "time": "2025-07-15 04:50:32",
                "url": "wss://193.200.173.45/Auth"
            },
            sslopt={"cert_reqs": CERT_NONE}
        )

        con.send(dumps({
            "action": "Register",
            "subaction": "Desktop",
            "locale": "en_US",
            "gmt": "+06",
            "password": {
                "m1x": "69300360a49885ffcccd292860faaf0108bbf3e2114ab39ec5ab9a7c75264370",
                "m1y": "8c9a2034b1c89af879d509c3e631a038efba19eea4f5f4eb5ca2a6c7f8d419b9",
                "m2": "bc1833199b1087b5a3e8e8bd4efffff8a5e600285aa24732a49690c18a5f6811",
                "iv": "f83f3540b692f8ff727ecb7b78f8084b",
                "message": "1bc14ee7ff32081e571563c7d55a385bfb9996e9edee86b17a571289d048708389bd5517b1cf98edce9e105f03759ec9bd2c4a4f0b4ef1917646b2ec222b87c0381ea8c578ba5ac0c6819d05c494baeb"
            },
            "magicword": {
                "m1x": "0d8eba73dff547505d7157c137ea696d1c661d76fc97e16063f948188091140e",
                "m1y": "bd77065ce1913ca89365de17c0ee0b9577b5b733d4740aa41c3501168bc0b28b",
                "m2": "905963a4d2b9394fdf2c2b63c88d6fee90d56d19b47ecbb4c7d3ed98b65b6496",
                "iv": "53fca9d404669b784c46df560ab26e71",
                "message": "9377b2231a5d68fdf5189d4211245cc5"
            },
            "magicwordhint": "0000",
            "login": username,
            "devicename": "TECNO BG6",
            "softwareversion": "1.1.0.1640",
            "nickname": "kahshslaksv",
            "os": "AND",
            "deviceuid": "75361877768956a3",
            "devicepushuid": "0000_0000_0000-0000_0000_0000-0000_0000_0000-0000_0000_0000",
            "osversion": "and_13.0.0",
            "id": "66699876"
        }))
        gzip = decompress(con.recv()).decode('utf-8')
        if '"status":"Success"' in gzip:
            success += 1
            accounts.append(username)
            with open('captain_hacker.txt', 'a') as f:
                f.write(username + " : Captain | TG : @Engineer_captain_real\n")
            print_success_banner(username)
            return "success", username
        else:
            failed += 1
            print_fail_banner(username)
            return "fail", username
    except Exception as e:
        retry += 1
        print_retry_banner(username)
        return "retry", username

if __name__ == "__main__":
    success, failed, retry = 0, 0, 0
    accounts = []

    password_input()
    welcome_message()

    start = ThreadPoolExecutor(max_workers=1000)

    while True:
        start.submit(work)
        print_status(success, failed, retry, accounts)
        time.sleep(0.01)