import './../styles/App.css';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Button } from '@mui/material';
import { GET_PROD_BIN_IDS, GET_PICKS_FROM_PROD_BIN_IDS, GET_PROD_FROM_EVAL } from '../GraphQLQueriesMuts/Query';
import { ADD_PICK_FOR_AN_EVAL } from '../GraphQLQueriesMuts/Mutation';
import { GET_BIN_FROM_BINID } from '../GraphQLQueriesMuts/Query';
import { EDIT_PICK_OUTCOME_TIME } from '../GraphQLQueriesMuts/Mutation';
import { useCSVReader } from 'react-papaparse';
import ObjectTable from './ObjectTable';

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import ROSLIB from "roslib";
import { useROS } from "react-ros";

interface PickHandlerProps {
}

interface TableObject {
    asin: string,
    productName: string,
    productBinId: any,
    binName: string,
}

function PickHandler(props: PickHandlerProps) {
    const debug = false;

    const [evalTextArea, setEvalTextArea] = useState<string>("");
    const [pickTextArea, setPickTextArea] = useState<string>("");
    const [uploadedData, setUploadedData] = useState<string[]>();
    const [picks, setPicks] = useState<TableObject[]>([]);
    const [errorObjects, setErrorObjects] = useState<string[]>([]);
    const [tableToDisplay, setTableToDisplay] = useState<JSX.Element[]>([]);
    const [isRobotMoving, setIsRobotMoving] = useState<boolean>(false);

    let pickId = "";

    const { CSVReader } = useCSVReader();


    const { refetch: prodBinRefetch } = useQuery(GET_PROD_BIN_IDS);
    const { refetch: picksFromProdBinRefetch } = useQuery(GET_PICKS_FROM_PROD_BIN_IDS);
    const { refetch: prodFromEvalRefetch } = useQuery(GET_PROD_FROM_EVAL);
    const { data: OneBinData, loading: OneBinLoading, error: OneBinError, refetch: OneBinRefetch } = useQuery(GET_BIN_FROM_BINID);
    const [add_pick] = useMutation(ADD_PICK_FOR_AN_EVAL);
    const [edit_pick] = useMutation(EDIT_PICK_OUTCOME_TIME);

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
                console.log(asinValue)
                let objectsInEval = await prodFromEvalRefetch({ evalName: evalTextArea, asin: asinValue });
                console.log(objectsInEval);
                // object not in eval check
                if (objectsInEval.data.getAmazonProductFromEval.length > 0) {
                    let value = await prodBinRefetch({ asin: asinValue, binId: objectsInEval.data.getAmazonProductFromEval[0].bin.BinId, evalName: evalTextArea });
                    let valueArr = value.data.getProductBinFromAmazonProductBinEval;
                    console.log(valueArr)
                    for (let k = 0; k < valueArr.length; k++) {
                        let prodBinIds = await picksFromProdBinRefetch({ ProductBinId: parseInt(valueArr[k].id) });
                        console.log(prodBinIds);
                        if (prodBinIds.data.getPicksFromProductBin.length == 0) {
                            objects.push({
                                "asin": asinValue,
                                "productName": objectsInEval.data.getAmazonProductFromEval[0].amazonProduct.name,
                                "productBinId": valueArr[k].id,
                                "binName": objectsInEval.data.getAmazonProductFromEval[0].bin.BinName
                            });
                            let addedPick = await add_pick({ variables: { ProductBinId: parseInt(valueArr[k].id) } });
                            console.log(addedPick);
                            pickId = addedPick.data.addPickWithOnlyProdBin.id;
                            console.log(pickId)
                            let tablecell: JSX.Element =
                                <TableRow>
                                    <TableCell>{objects[objects.length - 1]["productName"]}</TableCell>
                                    <TableCell>{objects[objects.length - 1]["asin"]}</TableCell>
                                    <TableCell>{objects[objects.length - 1]["binName"]}</TableCell>
                                    <TableCell>{objects[objects.length - 1]["productBinId"]}</TableCell>
                                </TableRow>
                            console.log(objects)
                            setTableToDisplay(current => [...current, tablecell])
                            // sendRequestToRobot(objects[objects.length - 1]["binName"], objects[objects.length - 1]["productBinId"])
                            var request = new ROSLIB.ServiceRequest({
                                bin_id: objects[objects.length - 1]["binName"],
                                object_id: "" + objects[objects.length - 1]["productBinId"] + ""
                            });
                            console.log(robotServiceClient);
                            setIsRobotMoving(true);
                            if (!debug) {
                                let startTime = Date.now();
                                let sendService = await robotServiceClient.callService(request, function (result: any) {
                                    console.log("Received back from the Robot: " +
                                        robotServiceClient.name +
                                        ': ' +
                                        result.success)
                                    setIsRobotMoving(false);
                                    let endTime = Date.now();
                                    console.log(endTime - startTime);
                                    edit_pick({variables: {id: pickId, outcome: result.success, time: (endTime - startTime)}});
                                });
                                await sendService.then((res: any) => {
                                    console.log(res);
                                })

                                // await robotServiceClient.callService(request, function (result: any) {
                                //     console.log("Received back from the Robot: " +
                                //         robotServiceClient.name +
                                //         ': ' +
                                //         result)
                                //     setIsRobotMoving(false);
                                //     let endTime = Date.now();
                                //     console.log(endTime - startTime);
                                //     edit_pick({variables: {id: pickId, outcome: result.success, time: (endTime - startTime)}});
                                // });
                            }
                            break;
                        }
                    }

                } else {
                    setErrorObjects(current => [...current, asinValue]);
                }
            }
        }
    }

    async function sendRequestToRobot(binName: string, prodBinId: string) {
        

    }

    return (
        <>
            <div id="left-content">
                <Button onClick={connectToRos}>Connect to Robot</Button>

                {isRobotMoving
                    ? <div> <p>Robot is moving</p>  {debug
                        ? <Button onClick={() => setIsRobotMoving(false)}>Done Moving</Button>
                        : <br />}
                    </div>
                    : <br />}

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
                <div id="heading-text">Evaluation Name</div>
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
            <Table>
                {tableToDisplay}
            </Table>

            <ObjectTable objectList={picks} />

            <div id="left-content">
                <div id="heading-text">Error ASINs</div>
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