import { useQuery, gql } from "@apollo/client";

export const ADD_PROD_TO_BIN_FOR_AN_EVAL = gql`
    mutation addProdToBin($asin: String!, $binId: String!, $evalName: String!) {
        addProdToBin(asin: $asin, binId: $binId, evalName: $evalName) {
            bin {
                BinId
            }
        }
    }
`

export const DELETE_PROD_FROM_BIN_FOR_AN_EVAL = gql`
    mutation delProdFromBin($id:ID!) {
        deleteProdFromBin(id: $id) {
            amazonProduct {
                asin
            }
        }
    }
`