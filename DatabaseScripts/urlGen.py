# Reads through the CSV and generates the Amazon URLs for all the items that have
# an ASIN value associated with it.

import csv

def generateURL(readFileName, writeFileName):
    newRows = []
    with open(readFileName) as csv_read_file:
        csv_reader = csv.reader(csv_read_file, delimiter=',')
        for row in csv_reader:
            newRow = row
            if row[1] == "ASIN":
                newRow.append("Amazon Link")
            else:
                newRow.append(f"https://www.amazon.com/dp/{row[1]}/")
            newRows.append(newRow)

    with open(writeFileName, mode="w", newline='') as csv_write_file:
        csv_writer = csv.writer(csv_write_file, delimiter=',')
        for row in newRows:
            csv_writer.writerow(row)

    print("done")


if __name__ == '__main__':
    generateURL("HaveASIN.csv", "HaveASIN_withAmazonURL.csv")