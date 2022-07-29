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