# Adds Amazon Products to the Database
from python_graphql_client import GraphqlClient
import csv

client = GraphqlClient(endpoint = "http://localhost:4000/")

readFileName = "DecoyAsin.csv"

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
        variables = {"asin": row[0], "name": row[0] + "_decoy_object", "size_len": float(row[1]), "size_wid": float(row[2]),
                         "size_hei": float(row[3]), "size_units": row[4], "weight": float(row[5]),
                         "weight_units": row[6], "attributes": []}
        data = client.execute(query=query, variables=variables)
        print(data)