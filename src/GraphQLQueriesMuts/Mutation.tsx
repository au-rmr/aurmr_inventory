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


export const ADD_AMAZON_PRODUCT = gql`
mutation addAmazonProduct($asin: String!, $name: String!, $size_length: Float, $size_width: Float, $size_height: Float, $size_units: String, $weight: Float, $weight_units: String) {
    addAmazonProduct(asin: $asin, name: $name, size_length: $size_length, size_width: $size_width, size_height: $size_height, size_units: $size_units, weight: $weight, weight_units: $weight_units, attributes: []) {
        asin
        name
        size_length
        size_width
        size_height
        size_units
        weight
        weight_units
    }
}
`

export const UPDATE_AMAZON_PRODUCT = gql`
mutation updateAmazonProduct($asin: String!, $name: String!, $size_length: Float, $size_width: Float, $size_height: Float, $size_units: String, $weight: Float, $weight_units: String) {
    updateAmazonProduct(asin: $asin, name: $name, size_length: $size_length, size_width: $size_width, size_height: $size_height, size_units: $size_units, weight: $weight, weight_units: $weight_units) {
        asin
        name
        size_length
        size_width
        size_height
        size_units
        weight
        weight_units
    }
}
`