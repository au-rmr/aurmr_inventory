# Failed attempt at trying to use proxy

import pandas as pd
import requests
from bs4 import BeautifulSoup as bs

from random import choice

import csv
import time


# proxy related code:
def get_proxies():
    proxy_url = "https://github.com/clarketm/proxy-list/blob/master/proxy-list-raw.txt"
    r = requests.get(proxy_url)
    soup = bs(r.content, "html.parser").find_all("td", {"class": "blob-code blob-code-inner js-file-line"})
    proxies = [proxy.text for proxy in soup]
    return proxies


def get_random_proxy(proxies):
    return {"https": choice(proxies)}


def get_working_proxies():
    working = []
    for i in range(400):
        proxy = get_random_proxy(get_proxies())
        print(f"using {proxy}...")
        try:
            r = requests.get("https://www.google.com", proxies=proxy, timeout=3)
            if r.status_code == 200:
                working.append(proxy)
                print("success")
        except:
            pass
    return working


if __name__ == "__main__":
    listOfProxy = get_working_proxies()
    writeFileName = "ListOfProxy.csv"
    with open(writeFileName, mode="w", newline='') as csv_write_file:
        csv_writer = csv.writer(csv_write_file, delimiter=',')
        for row in listOfProxy:
            csv_writer.writerow(row)
