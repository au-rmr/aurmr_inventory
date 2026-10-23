/**
 * @file GraphQL Mutation definitions
 *
 * Used with the Apollo client. See: https://www.apollographql.com/docs/react/data/mutations/
 */
import { useQuery, gql } from "@apollo/client";

export const ADD_PROD_TO_BIN_FOR_AN_EVAL = gql`
mutation addProdToBin($asin: String!, $binId: String!, $evalName: String!) {
    addProdToBin(asin: $asin, binId: $binId, evalName: $evalName) {
id        
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

export const ADD_PICK_FOR_AN_EVAL = gql`
    mutation addPickWithOnlyProdBin($ProductBinId: Int!) {
        addPickWithOnlyProdBin(ProductBinId: $ProductBinId) {
            ProductBinId
            Outcome
            TimeTakenSec
        }
    }
`

export const EDIT_PICK_OUTCOME_TIME = gql `
mutation editPickOutTime($id: Int!, $outcome: Boolean!, $time: Float!) {
	editPickOutcomeTime(id:$id, outcome:$outcome, time:$time) {
    Outcome
    TimeTakenSec
  }
}
`