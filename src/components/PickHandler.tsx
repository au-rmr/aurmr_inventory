import './../styles/App.css';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button } from '@mui/material';
import { GET_PROD_BIN_IDS, GET_PICKS_FROM_PROD_BIN_IDS, GET_PROD_FROM_EVAL } from '../GraphQLQueriesMuts/Query';
import { ADD_PICK_FOR_AN_EVAL, ADD_OUTCOME_AND_TIME_FOR_A_PICK } from '../GraphQLQueriesMuts/Mutation';
import { useCSVReader } from 'react-papaparse';
import ObjectTable from './ObjectTable';

import ROSLIB from "roslib";

interface PickHandlerProps {
}

interface TableObject {
    asin: string,
    productName: string,
    productBinId: any,
    binName: string,
}

function PickHandler(props: PickHandlerProps) {
    const debug: boolean = true;
    const [evalTextArea, setEvalTextArea] = useState<string>("");
    const [pickTextArea, setPickTextArea] = useState<string>("");
    const [uploadedData, setUploadedData] = useState<string[]>();
    const [pickTimes, setPickTimes] = useState<number[]>([]);
    const [picks, setPicks] = useState<TableObject[]>([]);
    const [robotIsMoving, setRobotIsMoving] = useState<boolean>(false);
    const [errorObjects, setErrorObjects] = useState<string[]>([]);
    const { CSVReader } = useCSVReader();
    const { refetch: prodBinRefetch } = useQuery(GET_PROD_BIN_IDS);
    const { refetch: picksFromProdBinRefetch } = useQuery(GET_PICKS_FROM_PROD_BIN_IDS);
    const { refetch: prodFromEvalRefetch } = useQuery(GET_PROD_FROM_EVAL);
    const [add_pick] = useMutation(ADD_PICK_FOR_AN_EVAL);
    const [add_info_to_pick] = useMutation(ADD_OUTCOME_AND_TIME_FOR_A_PICK);

    const [robotServiceClient, setRobotServiceClient] = useState<any>(0);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    function connectToRos() {
        let ros: any;
        ros = new ROSLIB.Ros({
            url: 'ws://control:9090'
        });

        ros.on('connection', function () {
            console.log('Connected to websocket server.');
            setIsConnected(true);
        });

        ros.on('error', function (error: any) {
            console.log('Error connecting to websocket server: ', error);
            setIsConnected(false);
        });

        ros.on('close', function () {
            console.log('Connection to websocket server closed.');
            setIsConnected(false);
        });

        setRobotServiceClient(new ROSLIB.Service({
            ros: ros,
            name: "aurmr_demo/pick",
            serviceType: "/aurmr_tasks/PickRequest"
        }));
    }

    function parsePickText() {
        let num = parseInt(pickTextArea as string);
        if (isNaN(num) || num < 0 || num > 100) {
            alert("Invalid entry please enter numbers between 0-100.");
            return;
        }

        return num;
    }

    async function onSubmit() {
        const numPicks = parsePickText();
        let objects: TableObject[] = [];
        setPicks([]);
        setErrorObjects([]);
        if (uploadedData && evalTextArea && numPicks) {
            for (let i = 0; i < uploadedData.length; i++) {
                const asinValue = uploadedData[i][0];
                let objectsInEval = await prodFromEvalRefetch({ evalName: evalTextArea, asin: asinValue });
                // object not in eval check
                if (objectsInEval.data.getAmazonProductFromEval.length > 0 && objectsInEval.data.getAmazonProductFromEval[0].bins.length > 0) {
                    console.log(objectsInEval);
                    let value = await prodBinRefetch({ asin: asinValue, binId: objectsInEval.data.getAmazonProductFromEval[0].bins[0].bin.BinId, evalName: evalTextArea });
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
                    picksAssociatedWithProdBinId = await picksFromProdBinRefetch({ ProductBinId: id });
                    if (picksAssociatedWithProdBinId.data.getPicksFromProductBin.length === 0) {
                        break;
                    } else {
                        id = -1;
                    }
                }

                if (id > -1) {
                    currentObject.productBinId = id;
                    const pickResult = await add_pick({ variables: { ProductBinId: id } });
                    const pickId = pickResult.data.addPickWithOnlyProdBin.id;
                    // Record current time
                    const startTime = Date.now();
                    // We send the message to ros with info; wait for ros to return a boolean
                    var request = new ROSLIB.ServiceRequest({
                        bin_id: currentObject.binName,
                        object_id: currentObject.productBinId
                    });
                    console.log(robotServiceClient);
                    setRobotIsMoving(true);
                    if (!debug) {
                        robotServiceClient.callService(request, async function (result: any) {
                            console.log("Received back from the Robot: " +
                                robotServiceClient.name +
                                ': ' +
                                result);
                            setRobotIsMoving(false);
                            // After the return value, record current time and subtract start time
                            const timeElapsed = (Date.now() - startTime) / 1000;
                            setPickTimes(current => [...current, timeElapsed]);
                            console.log(`seconds elapsed = ${timeElapsed}`);
                            // Mutate the pick and add the outcome and time taken
                            await add_info_to_pick({ variables: { id: pickId, Outcome: result, TimeTakenSec: timeElapsed } })
                        });
                    }
                    setPicks(current => [...current, currentObject]);
                } else {
                    setErrorObjects(current => [...current, currentObject.asin]);
                    i--;
                }
            }
        }
    }


    function renderWaitPage() {
        <div>
            <div id="heading-text">Robot in motion. Please wait...</div>
            {debug ? <Button onClick={() => setRobotIsMoving(false)}>Received Message</Button> : <br />}
        </div>
    }

    return (
        <div>
            {robotIsMoving ? <div>
                <div id="heading-text">Robot in motion. Please wait...</div>
                {debug ? <Button onClick={() => setRobotIsMoving(false)}>Received Message</Button> : <br />}
            </div> :
                <>
                    <div id="left-content">
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
                                    <ProgressBar />
                                </>
                            )}
                        </CSVReader>
                        <br />
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
                        /> <br />
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
                        /> <br />

                        <Button id="pick-button" variant="contained" color="success" onClick={onSubmit}>Submit</Button>

                    </div>

                    <div id="left-content">
                        <div id="heading-text">Pick Info</div>
                    </div>
                    <ObjectTable objectList={picks} />

                    <div id="left-content">
                        <div id="heading-text">Error ASINs</div>
                        {
                            errorObjects && errorObjects.map((value, index) => {
                                return (<div key={index} id="text">{value}</div>)
                            })
                        }
                    </div>

                    <div>
                        {
                            pickTimes && pickTimes.map((value, index) => {
                                return (<div key={index} id="text">{index + 1}. {value} seconds</div>)
                            })
                        }
                    </div>
                </>
            }

        </div>
    );

}

export default PickHandler;
