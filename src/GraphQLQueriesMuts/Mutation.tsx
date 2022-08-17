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

export const ADD_PICK_FOR_AN_EVAL = gql`
    mutation addPickWithOnlyProdBin($ProductBinId: Int!) {
        addPickWithOnlyProdBin(ProductBinId: $ProductBinId) {
            id
        }
    }
`

export const ADD_OUTCOME_AND_TIME_FOR_A_PICK = gql`
    mutation addOutcomeAndTimeToPick($id: String!, $Outcome: Boolean!, $TimeTakenSec: Float!) {
        addOutcomeAndTimeToPick(id: $id, Outcome: $Outcome, TimeTakenSec: $TimeTakenSec) {
            ProductBinId
        }
    }
`