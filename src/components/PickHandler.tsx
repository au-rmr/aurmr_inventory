import './../styles/App.css';
import { useEffect, useState } from 'react';
import { gql } from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { Button, FormControl, FormLabel, Input, InputLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { GET_PROD_BIN_IDS, GET_PICKS_FROM_PROD_BIN_IDS, GET_PROD_FROM_EVAL } from '../GraphQLQueriesMuts/Query';
import { ADD_PICK_FOR_AN_EVAL } from '../GraphQLQueriesMuts/Mutation';
import { useCSVReader } from 'react-papaparse';
import { rows } from '../Constants';
import ObjectTable from './ObjectTable';
import StopWatch from './StopWatch';

interface PickHandlerProps {
}

interface TableObject {
    asin: string,
    productName: string,
    productBinId: any,
    binName: string,
}

function PickHandler(props: PickHandlerProps) {
    const [evalTextArea, setEvalTextArea] = useState<string>("");
    const [pickTextArea, setPickTextArea] = useState<string>("");
    const [uploadedData, setUploadedData] = useState<string[]>();
    const [picks, setPicks] = useState<TableObject[]>([]);
    const [errorObjects, setErrorObjects] = useState<string[]>([]);
    const { CSVReader } = useCSVReader();
    const { refetch: prodBinRefetch } = useQuery(GET_PROD_BIN_IDS);
    const { refetch: picksFromProdBinRefetch } = useQuery(GET_PICKS_FROM_PROD_BIN_IDS);
    const { refetch: prodFromEvalRefetch } = useQuery(GET_PROD_FROM_EVAL);
    const [add_pick] = useMutation(ADD_PICK_FOR_AN_EVAL);

    async function onSubmit() {
        const numPicks = parsePickText();
        let objects: TableObject[] = [];
        setPicks([]);
        setErrorObjects([]);
        if (uploadedData && evalTextArea && numPicks) {
            for (let i = 0; i < uploadedData.length; i++) {
                const asinValue = uploadedData[i][0];
                let objectsInEval = await prodFromEvalRefetch({evalName: evalTextArea, asin: asinValue});
                // object not in eval check
                if (objectsInEval.data.getAmazonProductFromEval.length > 0) {
                    let value = await prodBinRefetch({asin: asinValue, binId: objectsInEval.data.getAmazonProductFromEval[0].bins[0].bin.BinId, evalName: evalTextArea});
                    objects.push({
                        asin: asinValue,
                        productName: objectsInEval.data.getAmazonProductFromEval[0].name,
                        productBinId: value.data.getProductBinFromAmazonProductBinEval,
                        binName: objectsInEval.data.getAmazonProductFromEval[0].bins[0].bin.BinName
                    });
                } else {
                    setErrorObjects(current => [...current, asinValue]);
                }
            }
            for (let i = 0; i < numPicks && objects.length > 0; i++) {
                let randIndex = Math.floor(Math.random() * (objects.length));
                // select object
                let currentObject = objects[randIndex];
                objects.splice(randIndex, 1);
                // go through prodBinIds
                let id = -1;
                let picksAssociatedWithProdBinId;
                for (let j = 0; j < currentObject.productBinId.length; j++) {
                    id = parseInt(currentObject.productBinId[j].id);
                    picksAssociatedWithProdBinId = await picksFromProdBinRefetch({ProductBinId: id});
                    if (picksAssociatedWithProdBinId.data.getPicksFromProductBin.length === 0) {
                        break;
                    } else {
                        id = -1;
                    }
                }
                
                if (id > -1) {
                    currentObject.productBinId = id;
                    await add_pick({variables: {ProductBinId: id}});
                    setPicks(current => [...current, currentObject]);
                } else {
                    setErrorObjects(current => [...current, currentObject.asin]);
                    i--;
                }
            }
        }
    }

    function parsePickText() {
        let num = parseInt(pickTextArea as string);
        if (isNaN(num) || num < 0 || num > 100) {
            alert("Invalid entry please enter numbers between 0-100.");
            return;
        }

        return num;
    }

    return (
        <>
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
                <div id="heading-text">Number of Picks</div>
                <textarea
                    id="pick-text-area"
                    onChange={(event) => setPickTextArea(event.target.value)}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                        }
                    }}
                    value={pickTextArea}
                /> <br/>
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
                <div id="heading-text">Non-Error Object Info</div>
            </div>
            <ObjectTable objectList={picks}/>

            <div id="left-content">
                <div id="heading-text">Error Object ASINs</div>
                {
                    errorObjects && errorObjects.map((value, index) => {
                        return (<div key={index} id="text">{value}</div>)
                    })
                }
            </div>

            {/* <StopWatch/> */}
        </>
    );
    
}

export default PickHandler;