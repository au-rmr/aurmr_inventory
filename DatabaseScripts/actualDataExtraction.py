# Extracts all the NAs out of the CSV file and provides a clean csv file with all
# the data.

import csv

def removeNA(readFileName, writeFileName):
    newRows = []
    with open(readFileName, encoding='utf-8') as csv_read_file:
        csv_reader = csv.reader(csv_read_file, delimiter=',')
        for row in csv_reader:
            print(row)
            if row[4] != "NA":
                newRows.append(row)

    with open(writeFileName, mode="w", newline='') as csv_write_file:
        csv_writer = csv.writer(csv_write_file, delimiter=',')
        for row in newRows:
            csv_writer.writerow(row)

    print("done")

if __name__ == '__main__':
    removeNA("UWItemSetASIN_withDescUpdated.csv", "UWItemSetASINAccurateInfo.csv")