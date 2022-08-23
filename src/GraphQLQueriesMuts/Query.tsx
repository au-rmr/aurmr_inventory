import { useQuery, gql } from "@apollo/client";

export const GET_ALL_BINS = gql`
    query getBins {
        getAllBins {
            BinId
            BinName
            TableId
            TableName
            depth
            width
            height
            dimensions_units
            AmazonProducts {
                amazonProduct {
                    name
                    size_length
                    size_width
                    size_height
                    size_units
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

export const GET_ALL_PROD = gql`
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

export const GET_ONE_PROD = gql`
query getsingleprod($asin: String!) {
    getProduct(filter: $asin) {
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
        bins {
          bin {
            BinId
            BinName
          }
          evaluation {
            name
          }
        }
    }
  }
`

export const GET_ONE_EVAL = gql`
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
                BinName
                TableName
                depth
                width
                height
                dimensions_units
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

export const GET_PROD_IN_BIN_FOR_EVAL = gql`
query getProdFromBinEval($binName: String!, $evalName: String!, $tableName:String!) {
    getAmazonProductFromBinEval(evalName: $evalName, binName: $binName, tableName:$tableName) {
           id
      bin {
        BinName
        TableName
        depth
        width
        height
        dimensions_units
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

export const GET_PROD_IN_BIN_ID_FOR_EVAL = gql`
query getProdFromBinIDEval($binId: String!, $evalName: String!, $tableName:String!) {
    getAmazonProductFromBinIdEval(evalName: $evalName, binId: $binId, tableName:$tableName) {
           id
      bin {
        BinName
        TableName
        depth
        width
        height
        dimensions_units
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

export const GET_BINS_BY_TABLE = gql`
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

export const GET_ONE_BIN_BY_TABLE_BINNAME = gql`
  query getBinFromTableAndBinName($tableName: String!, $binName: String!) {
    getBinByBinNameTable(binName:$binName, tableName: $tableName) {
      BinName
      height
      width
      depth
      dimensions_units
      BinId
      TableName
    }
  }
`

export const GET_BIN_FROM_BINID = gql `
query getBinBinid($binId: String!) {
  getBinByBinId(binId:$binId) {
    BinName
    height
    width
    depth
    dimensions_units
    BinId
    TableName
    AmazonProducts {
      amazonProduct {
        asin
        name
        size_width
        size_length
        size_height
        size_units
        weight
        weight_units
      }
    }
  }
}
`

export const GET_PROD_BIN_IDS = gql`
    query getProdBinIds($asin: String!, $binId: String!, $evalName: String!) {
        getProductBinFromAmazonProductBinEval(
            asin: $asin,
            binId: $binId,
            evalName: $evalName
        ){
            id
        }
    }
`

export const GET_PICKS_FROM_PROD_BIN_IDS = gql`
    query getPicks($ProductBinId: Int!) {
        getPicksFromProductBin(
            ProductBinId: $ProductBinId
        ){
            ProductBinId
        }
    }
`

export const GET_PROD_FROM_EVAL = gql`
query getProdFromEval($evalName: String!, $asin: String!) {
  getAmazonProductFromEval(evalName: $evalName, asin: $asin) {
      amazonProduct {
        name
        asin
      }
bin {
  BinId
  BinName
}
  }
}
`

export const GET_PRODBINID_FROM_EVALNAME = gql `
query getProdBinFromEval($evalName:String!) {
  getProdBinsFromEvalName(evalName:$evalName) {
    id
    amazonProduct {
      name
      asin
    }
    bin {
      BinName
    }
  }
}
`