import { useQuery, gql } from "@apollo/client";

export const GET_ALL_BINS = gql `
    query getBins {
        getAllBins {
            BinId
            BinName
            TableId
            TableName
            AmazonProducts {
                amazonProduct {
                    name
                    bins {
                        evaluation {
                            name
                        }
                    }
                }
            }
        }
    }
`

export const GET_ALL_PROD = gql `
query getAllProds {
    getAllProducts {
      id
      asin
      name
      size_length
      size_width
      size_height
      size_units
      weight
      weight_units
      attributes {
        AttributeId
        AmazonProductId
        attribute {
          id
          value
        }
      }
    }
  }
`

export const GET_ONE_EVAL = gql `
query getSingleEval($evalName:String!) {
    getOneEval(evalName: $evalName) {
        name
        Setup {
            id
            amazonProduct {
                name
            }
            bin {
                BinId
            }
            picks {
                ProductFromBin {
                    amazonProduct {
                        name
                    }
                    bin {
                        BinId
                    }
                }
            }
        }
    }
}
`

export const GET_PROD_IN_BIN_FOR_EVAL = gql `
query getProdFromBinEval($binName: String!, $evalName: String!, $tableName:String!) {
    getAmazonProductFromBinEval(evalName: $evalName, binName: $binName, tableName:$tableName) {
           id
      bin {
        BinName
        TableName
      } 
      evaluation {
        name
      }
      amazonProduct {
        id
        asin
        name
        size_length
        size_width
        size_height
        size_units
        weight
        weight_units
        attributes {
          AttributeId
          AmazonProductId
          attribute {
            id
            value
          }
        }
      }
    }
  }
`

export const GET_BINS_BY_TABLE = gql `
    query getBinsByTable($tableName: String!) {
        getBinByTable(tableName:$tableName) {
        BinName
        TableName
        AmazonProducts {
            id
            amazonProduct {
                name
                asin
                bins {
                    evaluation {
                        name
                    }
                }
            }
        }
        }
    }
`