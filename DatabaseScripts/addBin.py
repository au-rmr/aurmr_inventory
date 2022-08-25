# Adds Bin information into the Database
from python_graphql_client import GraphqlClient
import csv

client = GraphqlClient(endpoint="http://localhost:4000/")

readFileName = "DatabaseInfo.csv"

mutation = """
    mutation addBin($binId: String!, $binName: String!, $tableId: String!, $tableName: String, $bDepth:Float, $bWidth:Float, $bHeight:Float, $bUnits:String) {
  createBin(BinId: $binId, BinName: $binName, TableId:$tableId, TableName:$tableName, depth:$bDepth, width: $bWidth, height: $bHeight, units: $bUnits) {
    BinId
    BinName
    TableId
    TableName
    depth
    width
    height
    dimensions_units
  }
}
"""

with open(readFileName) as csv_read_file:
    csv_reader = csv.reader(csv_read_file, delimiter=',')
    for row in csv_reader:
        if (row[1] != "TableName"):
            tableId = row[0]
            tableName = row[1]
            binNum = row[2]
            binLetter = row[3]
            binName = binNum + binLetter
            binId = row[4]

            binDepth = float(row[5])
            binWidth = float(row[6])
            binHeight = float(row[7])
            binUnits = "inches"

            variables = {
                "binId": binId,
                "binName": binName,
                "tableId": tableId,
                "tableName": tableName,
                "bDepth": binDepth,
                "bWidth": binWidth,
                "bHeight": binHeight,
                "bUnits": binUnits
            }

            data = client.execute(query=mutation, variables=variables)
            print(data)
