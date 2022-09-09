# Scraping Script: Gets all the information from Amazon Website by Querying the URL
# If a certain information is unavailable, then it assigns a value of "NA" and moves on

# methodology: Reads from CSV, scrapes the web, and then rewrites into the CSV

# Resolves the problem detailed in getProductDetails.py

# Problem: Currently only gets size and weight information if it is in the form of
# bullets. But, some items have a table for sizes and weights, which are getting
# returned as NA.

import pandas as pd
import requests
from bs4 import BeautifulSoup as bs

import csv
import time

HEADERS = ({'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64)AppleWebKit/537.36 (KHTML, like Gecko)Chrome/44.0.2403.157 Safari/537.36',
                                'Accept-Language': 'en-US, en;q=0.5'})

def scrapper(url):
    response = requests.get(url, headers=HEADERS)
    soup = bs(response.content, "html.parser")
    try:
        title = soup.find("span", attrs={"id": 'productTitle'})
        title_value = title.string
        title_string = title_value.strip().replace(',', '')

        size = soup.find("div", attrs={"id": "detailBullets_feature_div"})
        ul = size.find("ul")
        allLists = ul.find_all("li")
        dims = allLists.pop(1)
        actualDims = dims.find_all("span")
        actualDims2 = actualDims.pop(2)
        actualDims2Text = actualDims2.getText()

        dims_text = actualDims2Text.split("; ")
        try:
            size = dims_text[0]
        except:
            size = "NA"

        try:
            weight = dims_text[1]
        except:
            weight = "NA"

    except AttributeError:
        title_string = "NA"
        size = "NA"
        weight = "NA"

    print([title_string, size, weight])
    return [title_string, size, weight]


def readWriteToCsv(readFileName, writeFileName):
    newRows = []
    with open(readFileName) as csv_read_file:
        csv_reader = csv.reader(csv_read_file, delimiter=',')
        for row in csv_reader:
            newRow = row
            if (row[3] != "Amazon Link"):
                listvals = scrapper(row[3])
                newRow.append(listvals[0])
                newRow.append(listvals[1])
                newRow.append(listvals[2])
                # time.sleep(20)
            else:
                newRow.append("Description")
                newRow.append("Size")
                newRow.append("Weight")
            newRows.append(newRow)

    with open(writeFileName, mode="w", newline='') as csv_write_file:
        csv_writer = csv.writer(csv_write_file, delimiter=',')
        for row in newRows:
            csv_writer.writerow(row)

if __name__ == "__main__":
    readWriteToCsv("UWItemSetASIN_withAmazonURL.csv", "UWItemSetASIN_withDesc.csv")
    print("done")