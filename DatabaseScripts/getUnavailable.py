# From Script2UWItemSetList, this script gets all the items that either have size or weight as unavailable and puts them
# into another csv file.

import csv

readFileName = "Script2UWItemSetList.csv"
writeFileName = "Script2UWItempSetList_Unavailable.csv"

with open(readFileName, encoding="utf8") as csv_read_file:
    csv_reader = csv.reader(csv_read_file, delimiter=',')
    for row in csv_reader:
        if row[5] == "NA" or row[6] == "NA":
            with open(writeFileName, mode="a", newline='') as csv_write_file:
                csv_writer = csv.writer(csv_write_file, delimiter=',')
                csv_writer.writerow(row);
                csv_write_file.close()