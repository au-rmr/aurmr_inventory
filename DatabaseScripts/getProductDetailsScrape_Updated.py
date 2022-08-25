# Scraping Script: Gets all the information from Amazon Website by Querying the URL
# If a certain information is unavailable, then it assigns a value of "NA" and moves on

# methodology: Reads from CSV, scrapes the web, and then rewrites into the CSV

# Resolves the problem detailed in getProductDetails.py

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
    except:
        title_string = "NA"

    try:
        size = soup.find("div", attrs={"id": "detailBullets_feature_div"})
        ul = size.find("ul")
        allLists = ul.find_all("li")
        indexToPop = -1
        for item in allLists:
            headings = item.find("span", attrs={"class": "a-text-bold"})
            if "Package Dimensions" in headings.getText() or "Product Dimensions" in headings.getText() or "Item Dimensions" in headings.getText():
                indexToPop = allLists.index(item)
        if indexToPop != -1:
            dims = allLists.pop(indexToPop)
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
        else:
            size = "NA"
            weight = "NA"

    except:
        try:
            table = soup.find("table", attrs={"class": "a-keyvalue prodDetTable"})
            headings = table.find_all("th", attrs={"class": "a-color-secondary a-size-base prodDetSectionEntry"})
            content = table.find_all("td", attrs={"class": "a-size-base prodDetAttrValue"})
            i_size = -1
            i_weight = -1
            for item in headings:
                if (" Item Dimensions  LxWxH " in item) or (" Product Dimensions " in item):
                    i_size = headings.index(item)
                elif (" Package Weight " in item) or (" Item Weight " in item):
                    i_weight = headings.index(item)

            if i_size != -1:
                itemPackageDims = content[i_size]
                size = itemPackageDims.getText().strip().strip("\u200e")
            else:
                size = "NA"

            if i_weight != -1:
                itemPackageWeight = content[i_weight]
                weight = itemPackageWeight.getText().strip().strip("\u200e")
            else:
                weight = "NA"
        except:
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
                time.sleep(10)
            else:
                newRow.append("Description")
                newRow.append("Size")
                newRow.append("Weight")
            newRows.append(newRow)
            with open(writeFileName, mode="a", newline='') as csv_write_file:
                csv_writer = csv.writer(csv_write_file, delimiter=',')
                csv_writer.writerow(newRow);
                csv_write_file.close()


if __name__ == "__main__":
    readWriteToCsv("HaveASIN_withAmazonURL.csv", "HaveASIN_withAmazonURL_DataExtracted.csv")
    print("done")
