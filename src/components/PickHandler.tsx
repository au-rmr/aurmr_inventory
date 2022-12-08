import './../styles/App.css';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Paper, TableContainer, TableHead } from '@mui/material';
import { GET_PROD_BIN_IDS, GET_PICKS_FROM_PROD_BIN_IDS, GET_PROD_FROM_EVAL, GET_PRODBINID_FROM_EVALNAME } from '../GraphQLQueriesMuts/Query';
import { ADD_PICK_FOR_AN_EVAL } from '../GraphQLQueriesMuts/Mutation';
import { GET_BIN_FROM_BINID } from '../GraphQLQueriesMuts/Query';
import { EDIT_PICK_OUTCOME_TIME } from '../GraphQLQueriesMuts/Mutation';
import { useCSVReader } from 'react-papaparse';

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import ROSLIB from "roslib";
import { useROS } from "react-ros";
import { BorderInnerSharp } from '@mui/icons-material';

interface PickHandlerProps {
}

function PickHandler(props: PickHandlerProps) {
    const debug = false;

    const [evalTextArea, setEvalTextArea] = useState<string>("");
    const [uploadedData, setUploadedData] = useState<string[]>();
    const [errorObjects, setErrorObjects] = useState<string[]>([]);
    const [tableToDisplay, setTableToDisplay] = useState<JSX.Element[]>([
        <TableHead>
            <TableRow>
                <TableCell><strong>Index</strong></TableCell>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell align="right"><strong>ASIN</strong></TableCell>
                <TableCell align="right"><strong>Bin Name</strong></TableCell>
                <TableCell align="right"><strong>Product Bin ID</strong></TableCell>
            </TableRow>
        </TableHead>
    ]);
    const [isRobotMoving, setIsRobotMoving] = useState<boolean>(false);
    const [pickingMsg, setPickingMsg] = useState<any>("");
    const [pickingName, setPickingName] = useState<string>("");

    let pickId = "";

    const { CSVReader } = useCSVReader();


    const { refetch: prodBinRefetch } = useQuery(GET_PROD_BIN_IDS);
    const { refetch: picksFromProdBinRefetch } = useQuery(GET_PICKS_FROM_PROD_BIN_IDS);
    const { refetch: prodFromEvalRefetch } = useQuery(GET_PROD_FROM_EVAL);
    const { data: OneBinData, loading: OneBinLoading, error: OneBinError, refetch: OneBinRefetch } = useQuery(GET_BIN_FROM_BINID);
    const [add_pick] = useMutation(ADD_PICK_FOR_AN_EVAL);
    const [edit_pick] = useMutation(EDIT_PICK_OUTCOME_TIME);
    const { refetch: getItemsFromEval } = useQuery(GET_PRODBINID_FROM_EVALNAME);

    const [robotServiceClient, setRobotServiceClient] = useState<any>(0);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    async function onSubmit() {
        let objects: any[] = [];
        setErrorObjects([]);
        if (uploadedData && evalTextArea) {
            let bin_ids: string[] = [];
            let object_ids: string[] = [];
            let count2 = 0;
            for (let i = 0; i < uploadedData.length; i++) {
                const asinValue = uploadedData[i][0];
                console.log(asinValue)
                let objectsInEval = await prodFromEvalRefetch({ evalName: evalTextArea, asin: asinValue });
                console.log(objectsInEval);
                // object not in eval check
                if (objectsInEval.data.getAmazonProductFromEval.length > 0) {
                    for (let j = 0; j < objectsInEval.data.getAmazonProductFromEval.length; j++) {
                        let value = await prodBinRefetch({ asin: asinValue, binId: objectsInEval.data.getAmazonProductFromEval[j].bin.BinId, evalName: evalTextArea });
                        let valueArr = value.data.getProductBinFromAmazonProductBinEval;
                        console.log(valueArr)
                        for (let k = 0; k < valueArr.length; k++) {
                            let prodBinIds = await picksFromProdBinRefetch({ ProductBinId: parseInt(valueArr[k].id) });
                            console.log(prodBinIds);
                            if (prodBinIds.data.getPicksFromProductBin.length == 0) {
                                objects.push({
                                    "asin": asinValue,
                                    "productName": objectsInEval.data.getAmazonProductFromEval[j].amazonProduct.name,
                                    "productBinId": valueArr[k].id,
                                    "binName": objectsInEval.data.getAmazonProductFromEval[j].bin.BinName
                                });
                                let addedPick = await add_pick({ variables: { ProductBinId: parseInt(valueArr[k].id) } });
                                console.log(addedPick);
                                pickId = addedPick.data.addPickWithOnlyProdBin.id;
                                console.log(pickId)
                                count2++;
                                let tablecell: JSX.Element =
                                    <TableRow>
                                        <TableCell>{count2}</TableCell>
                                        <TableCell>{objects[objects.length - 1]["productName"]}</TableCell>
                                        <TableCell>{objects[objects.length - 1]["asin"]}</TableCell>
                                        <TableCell>{objects[objects.length - 1]["binName"]}</TableCell>
                                        <TableCell>{objects[objects.length - 1]["productBinId"]}</TableCell>
                                    </TableRow>
                                console.log(objects)
                                setTableToDisplay(current => [...current, tablecell])

                                bin_ids.push(objects[objects.length - 1]["binName"]);
                                object_ids.push("" + objects[objects.length - 1]["productBinId"] + "")

                                setIsRobotMoving(true);
                                break;
                            }
                        }
                    }

                } else {
                    setErrorObjects(current => [...current, asinValue]);
                }
            }
            if (!debug) {
                let startTime = Date.now();
                var request = new ROSLIB.ServiceRequest({
                    bin_ids: bin_ids,
                    object_ids: object_ids
                });
                console.log(request);

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

                let robotServiceClient = new ROSLIB.Service({
                    ros: ros,
                    name: "aurmr_demo/multiple_pick",
                    serviceType: "/aurmr_tasks/MultiplePickRequest"
                });

                robotServiceClient.callService(request, function (result: any) {
                    console.log("Received back from the Robot: " +
                        robotServiceClient.name +
                        ': ' +
                        result.success)
                    setIsRobotMoving(false);
                    let endTime = Date.now();
                    console.log(endTime - startTime);
                    // edit_pick({variables: {id: pickId, outcome: result.success, time: (endTime - startTime)}});
                })

                var listener = new ROSLIB.Topic({
                    ros: ros,
                    name: '/demo_status',
                    messageType: 'aurmr_tasks/PickStatus'
                });

                listener.subscribe(async function (message: any) {
                    console.log(message);
                    setPickingMsg(message);
                    let pick = await picksFromProdBinRefetch({ ProductBinId: parseInt(message.object_id) });
                    console.log(pick)
                    let pickId = pick.data.getPicksFromProductBin[0].id;
                    setPickingName(pick.data.getPicksFromProductBin[0].ProductFromBin.amazonProduct.name);
                    if (message.status != "picking") {
                        await edit_pick({ variables: { id: parseInt(pickId), outcome: message.status == "item_detected", time: parseFloat(message.time) } });
                    }
                });

            }
        }
    }

    // async function listenToMessage() {
    //     let ros: any;
    //     ros = new ROSLIB.Ros({
    //         url: 'ws://control:9090'
    //     });

    //     ros.on('connection', function () {
    //         console.log('Connected to websocket server.');
    //         setIsConnected(true);
    //     });

    //     ros.on('error', function (error: any) {
    //         console.log('Error connecting to websocket server: ', error);
    //         setIsConnected(false);
    //     });

    //     ros.on('close', function () {
    //         console.log('Connection to websocket server closed.');
    //         setIsConnected(false);
    //     });


    // }

    async function clickDownload() {
        let getProdsFromEval = await getItemsFromEval({ evalName: evalTextArea });
        let allProdsToDownload = [];
        console.log(getProdsFromEval);
        let csvContent = "data:text/csv;charset=utf-8,";
        console.log(getProdsFromEval.data.getProdBinsFromEvalName);
        for (let i = 0; i < getProdsFromEval.data.getProdBinsFromEvalName.length; i++) {
            allProdsToDownload.push(getProdsFromEval.data.getProdBinsFromEvalName[i].amazonProduct.asin + ", " + getProdsFromEval.data.getProdBinsFromEvalName[i].bin.BinName + ", " + getProdsFromEval.data.getProdBinsFromEvalName[i].amazonProduct.name);
        }

        for (let j = 0; j < allProdsToDownload.length; j++) {
            csvContent += allProdsToDownload[j];
            csvContent += "\n";
        }

        console.log(allProdsToDownload);
        var encodedUri = encodeURI(csvContent);
        encodedUri = encodedUri.replace(/#/g, '%23'); // bc encodeURI doesn't replace #
        console.log(csvContent);
        window.open(encodedUri);
    }

    return (
        <div style={{ "padding": "50px", display: "grid", gridTemplateColumns: "25% 75%", gridGap: 10 }}>
            <div>
                <h1>Pick Handler</h1>
                {isRobotMoving
                    ? <div> <p>Robot is executing the Picks. Please wait...</p>  {debug
                        ? <Button onClick={() => setIsRobotMoving(false)}>Done Moving</Button>
                        : <br />}
                    </div>
                    : <br />
                }
                <div style={{ "margin": "25px", "marginTop": "0px" }}>
                    Step 1: <div id="heading-text">Evaluation Name</div>
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
                    <Button variant="contained" onClick={clickDownload}>Download</Button>
                </div>
                <div style={{ "margin": "25px" }}>
                    Step 2: <div id="heading-text">Upload File</div>
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
                                    <Button id="pick-button" variant="outlined" style={{ "display": "inline" }} onClick={onSubmit} {...getRootProps()}>
                                        Browse
                                    </Button>
                                    <div id="text">
                                        {acceptedFile && acceptedFile.name}
                                    </div>
                                    <Button id="pick-button" variant="outlined" style={{ "display": "inline" }} color="error" {...getRemoveFileProps()}>
                                        Remove
                                    </Button>
                                </div>
                                <ProgressBar />
                            </>
                        )}
                    </CSVReader>
                    <br />
                    Step 3:
                    <Button style={{ "marginLeft": "10px" }} id="pick-button" variant="contained" color="success" onClick={onSubmit}>Submit</Button>
                </div>
            </div>

            <div>
                <h3>{pickingMsg.status} -- ProdBinId: {pickingMsg.object_id} -- Product Name: {pickingName}</h3>
                <div>
                    <div id="heading-text">Pick Info</div>
                    <TableContainer id="table" component={Paper}>
                        <Table size="small">
                            {tableToDisplay}
                        </Table>
                    </TableContainer>
                </div>

                <div style={{ "marginTop": "20px" }}>
                    <div id="heading-text">Error ASINs</div>
                    {
                        errorObjects && errorObjects.map((value, index) => {
                            return (<div key={index} id="text">{value}</div>)
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default PickHandler;