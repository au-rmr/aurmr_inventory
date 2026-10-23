# Adds Amazon Products to the Database
from python_graphql_client import GraphqlClient
import csv

client = GraphqlClient(endpoint = "http://localhost:4000/")

readFileName = "/data/temp/large_object_db.csv"

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

headers = ['bar_code', 'asin', 'name', 'size_len', 'size_wid', 'size_hei', 'size_units', 'weight', 'weight_units']
numeric_fields = ['size_len', 'size_wid', 'size_hei', 'weight']
header_to_idx = {'bar_code': 0, 'asin': 1, 'name': 2, 'size_len': 3, 'size_wid': 4, 'size_hei': 5, 'size_units': 6,
           'weight': 7, 'weight_units': 8}


attributeToId = {"CanRoll": 1, "SixSidedRectangular": 2, "Deformable" : 3, "HardContainer": 4, "PlasticBag": 5,
                 "ContainsLiquid": 6, "MinimalPackagingSingleItem": 7, "Evil Items": 8}

with open(readFileName, encoding="utf8") as csv_read_file:
    csv_reader = csv.reader(csv_read_file, delimiter=',')
    next(csv_reader, None)  # skip the headers
    next(csv_reader, None)
    for row in csv_reader:
        variables = {}
        for i, header in enumerate(headers):
            variables[header] = row[i]
            if header in numeric_fields:
                variables[header] = float(variables[header])
        
        if variables['asin'] == '':
            assert 'bar_code' in variables and variables['bar_code'] != '', "At least one of asin or bar_code must be set"
            variables['asin'] = variables['bar_code']

        del variables['bar_code']

        variables['size_units'] = 'inches'
        variables['weight_units'] = 'lbs'
        variables['attributes'] = []

        data = client.execute(query=query, variables=variables)
        print(variables)
        print('---')
        print(data)
        # break
        # variables = {"asin": row[0], "name": row[0] + "_decoy_object", "size_len": float(row[1]), "size_wid": float(row[2]),
        #                  "size_hei": float(row[3]), "size_units": row[4], "weight": float(row[5]),
        #                  "weight_units": row[6], "attributes": []}
        
        # print(data)
    print('done!')