# Adds Amazon Products to the Database
from python_graphql_client import GraphqlClient
import csv

client = GraphqlClient(endpoint = "http://localhost:4000/")

readFileName = "HaveASIN_withAmazonURL_ActualData.csv"

query = """
    mutation addAmzProd(
  $asin: String!
  $name: String!
  $size_len: Float
  $size_wid: Float
  $size_hei: Float
  $size_units: String
  $weight: Float
  $weight_units: String
  $attributes: [ID]
) {
  addAmazonProduct(
    asin: $asin
    name: $name
    size_length: $size_len
    size_width: $size_wid
    size_height: $size_hei
    size_units: $size_units
    weight: $weight
    weight_units: $weight_units
    attributes: $attributes
  ) {
    name
  }
}
"""

attributeToId = {"CanRoll": 1, "SixSidedRectangular": 2, "Deformable" : 3, "HardContainer": 4, "PlasticBag": 5,
                 "ContainsLiquid": 6, "MinimalPackagingSingleItem": 7, "Evil Items": 8}

with open(readFileName, encoding="utf8") as csv_read_file:
    csv_reader = csv.reader(csv_read_file, delimiter=',')
    for row in csv_reader:
        if (row[1] != "ASIN"):
            # size stuff:
            size = row[5]
            sizeArr = size.split(" x ")
            if (size == "NA" or len(sizeArr) != 3):
                sizeLen = -1.0
                sizeWid = -1.0
                sizeheight = -1.0
                sizeUnits = "Unavailable"
            else:
                try:
                    sizeLen = float(sizeArr[0])
                    print(sizeArr)
                    sizeWid = float(sizeArr[1])
                    sizeheightArr = sizeArr[2].split(" ")
                    sizeheight = float(sizeheightArr[0])
                    sizeUnits = sizeheightArr[1]
                except:
                    sizeLen = -1.0
                    sizeWid = -1.0
                    sizeheight = -1.0
                    sizeUnits = "Unavailable"


            # weight stuff:
            weight = row[6]
            weightArr = weight.split(" ")
            if (weight == "NA" or len(weightArr) != 2):
                weightVal = -1.0
                weightUnits = "Unavailable"
            else:
                try:
                    weightVal = float(weightArr[0])
                    weightUnits = weightArr[1]
                except:
                    weightVal = -1.0
                    weightUnits = "Unavailable"

            variables = {"asin": row[1], "name": row[4], "size_len": sizeLen, "size_wid": sizeWid,
                         "size_hei": sizeheight, "size_units": sizeUnits, "weight": weightVal,
                         "weight_units": weightUnits, "attributes": []}

            data = client.execute(query=query, variables=variables)
            print(data)