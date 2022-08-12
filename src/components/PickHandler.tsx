import './../styles/App.css';
import { useEffect, useState } from 'react';
import { gql } from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { Button, FormControl, FormLabel, Input, InputLabel } from '@mui/material';
import { GET_PROD_BIN_IDS, GET_PICKS_FROM_PROD_BIN_IDS, GET_PROD_FROM_EVAL } from '../GraphQLQueriesMuts/Query';
import { ADD_PICK_FOR_AN_EVAL } from '../GraphQLQueriesMuts/Mutation';
import { useCSVReader } from 'react-papaparse';

interface PickHandlerProps {
}

interface tableObject {
    asin: string,
    productName: string,
    productBinId: number,
    binName: string,
}
function PickHandler(props: PickHandlerProps) {
    const [evalTextArea, setEvalTextArea] = useState<string>("");
    const [uploadedData, setUploadedData] = useState<string[]>();
    const [objects, setObjects] = useState<tableObject[]>([]);
    const [errorObjects, setErrorObjects] = useState<string[]>([]);
    const { CSVReader } = useCSVReader();
    const { data: getProdBinData, loading: getProdBinLoading, error: getProdBinError, refetch: prodBinRefetch } = useQuery(GET_PROD_BIN_IDS);
    const { refetch: picksFromProdBinRefetch } = useQuery(GET_PICKS_FROM_PROD_BIN_IDS);
    const { refetch: prodFromEvalRefetch } = useQuery(GET_PROD_FROM_EVAL);
    const [add_pick, { data: addPickData, loading: addPickLoading, error: addPickError }] = useMutation(ADD_PICK_FOR_AN_EVAL);

    async function onSubmit() {
        if (uploadedData && evalTextArea) {
            for (let i = 0; i < uploadedData.length; i++) {
                const asinValue = uploadedData[i];
                let objectsInEval = await prodFromEvalRefetch({evalName: evalTextArea, asin: asinValue[0]});
                // object not in eval check
                if (objectsInEval.data.getAmazonProductFromEval.length > 0) {
                    let value = await prodBinRefetch({asin: asinValue[0], binId: objectsInEval.data.getAmazonProductFromEval[0].bins[0].bin.BinId, evalName: evalTextArea});
                    let id = -1;
                    let picksAssociatedWithProdBinId: any;
                    for (let i = 0; i < value.data.getProductBinFromAmazonProductBinEval.length; i++) {
                        id = parseInt(value.data.getProductBinFromAmazonProductBinEval[0].id);
                        picksAssociatedWithProdBinId = await picksFromProdBinRefetch({ProductBinId: id});
                        if (picksAssociatedWithProdBinId.data.getPicksFromProductBin.length === 0) {
                            break;
                        } else {
                            id = -1;
                        }
                    }
                    // object not already picked check
                    if (id > -1) {
                        setObjects(current => [...current, {
                            asin: asinValue[0],
                            productName: objectsInEval.data.getAmazonProductFromEval[0].name,
                            productBinId: id,
                            binName: objectsInEval.data.getAmazonProductFromEval[0].bins[0].bin.BinName
                        }]);
                        add_pick({variables: {ProductBinId: id}})
                    } else {
                        setErrorObjects(current => [...current, asinValue[0]]);
                    }
                } else {
                    setErrorObjects(current => [...current, asinValue[0]]);
                }
            }
        }
    }

    function renderError() {
        if (addPickLoading) return <p>Submitting...</p>
        if (addPickError) return <p>Error: {addPickError.message}</p>
        if (getProdBinLoading) return <p>Loading...</p>
        if (getProdBinError) return <p>Error: {getProdBinError.message}</p>
    }

    return (
        <>
            {renderError()}
            <div id = "left-content">
                <div id="heading-text">Upload File</div>
                <CSVReader
                    onUploadAccepted={(results: any) => {
                        setUploadedData(results.data)
                    }}
                >
                    {({
                        getRootProps,
                        acceptedFile,
                        ProgressBar,
                        getRemoveFileProps
                    }: any) => (
                        <>
                            <div>
                                <Button id="pick-button" variant="outlined" onClick={onSubmit} {...getRootProps()}>
                                    Browse
                                </Button>
                                <div id="text">
                                    {acceptedFile && acceptedFile.name}
                                </div>
                                <Button id="pick-button" variant="outlined" color="error" {...getRemoveFileProps()}>
                                    Remove
                                </Button>
                            </div>
                            <ProgressBar/>
                        </>
                    )}
                </CSVReader>
                <br/>
                <div id="heading-text">Evalution Name</div>
                <textarea
                    id="pick-text-area"
                    onChange={(event) => setEvalTextArea(event.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onSubmit();
                        }
                    }}
                    value={evalTextArea}
                /> <br/>

                <Button id="pick-button" variant="contained" color="success" onClick={onSubmit}>Submit</Button>
                
            </div>
            <div id="left-content">
                <div id="heading-text">Non-Error Object ASINs</div>
                {
                    objects && objects.map((value, index) => {
                        return (<div key={index} id="text">{value.asin}</div>)
                    })
                }
                <div id="heading-text">Error Object ASINs</div>
                {
                    errorObjects && errorObjects.map((value, index) => {
                        return (<div key={index} id="text">{value}</div>)
                    })
                }
            </div>
        </>
    );
    
}

export default PickHandler;