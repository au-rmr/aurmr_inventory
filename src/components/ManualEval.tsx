import React, { Component, useEffect, useState } from 'react';
import "../styles/ManualEval.css";
import { useRef } from 'react';

import { Link } from 'react-router-dom';
import Cell from './Cell';
import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { GET_ALL_BINS } from '../GraphQLQueriesMuts/Query';
import { GET_ALL_PROD } from '../GraphQLQueriesMuts/Query';
import { ADD_PROD_TO_BIN_FOR_AN_EVAL } from '../GraphQLQueriesMuts/Mutation';
import { GET_ONE_EVAL } from '../GraphQLQueriesMuts/Query';
import { GET_PROD_IN_BIN_FOR_EVAL } from '../GraphQLQueriesMuts/Query';
import { GET_PROD_IN_BIN_ID_FOR_EVAL } from '../GraphQLQueriesMuts/Query';
import { GET_ONE_PROD } from '../GraphQLQueriesMuts/Query';
import { GET_BIN_FROM_BINID } from '../GraphQLQueriesMuts/Query';
import { convertCompilerOptionsFromJson, JsxEmit } from 'typescript';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import RadioGroup from '@mui/material/RadioGroup';
import Radio from "@mui/material/Radio";

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { matrix, subtract, row, ResultSetDependencies } from 'mathjs';

import ROSLIB from "roslib";
import { useROS } from "react-ros";

interface ManualEvalProps {

}

interface ManualEvalState {
    rows: JSX.Element[]
    cols: JSX.Element[]
}

function ManualEval(props: any) {
    const debug: boolean = true;

    const NUM_ROWS: number = 10;
    const NUM_COLS: number = 10;

    const table1 = {
        rows: 13,
        cols: 4
    }

    const table2 = {
        rows: 8,
        cols: 3
    }

    const [rows, setRows] = useState<JSX.Element[]>([]);
    const [cols, setCols] = useState<JSX.Element[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tables, setTables] = useState<String>("");
    const [isASINError, setisAsinError] = useState<boolean>(false);
    const [isBinError, setisBinError] = useState<boolean>(false);
    const [submitableProd, setSubmitableProd] = useState<string>("");
    const [submitableBin, setSubmitableBin] = useState<string>("");
    const [binErrorMsg, setBinErrorMsg] = useState<String>("");
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const refASIN = useRef<HTMLInputElement>(null);
    const refBin = useRef<HTMLInputElement>(null);
    const [evalNameDisabled, setEvalNameDisabled] = useState<boolean>(false);
    const [evalNameError, setEvalNameError] = useState<boolean>(false);
    const [autoOrManual, setAutoOrManual] = useState<string>("Automatic");
    const [submitableEvalName, setSubmitableEvalName] = useState<string>("");
    const [table1Actual, setTable1Actual] = useState<JSX.Element>(<table></table>)
    const [tableName, setTableName] = useState<string>("");
    const [tableError, setTableError] = useState<boolean>(false);
    const [tableDisabled, setTableDisabled] = useState<boolean>(false);
    const [podGCU, setpodGCU] = useState<number>(0);
    const [maxBinGCUDisabled, setMaxBinGCUDisabled] = useState<boolean>(false);
    const [maxBinGCUError, setMaxBinGCUError] = useState<boolean>(false);
    const [maxBinGCU, setMaxBinGCU] = useState<string>("1");
    const [eachBinGCU, setEachBinGCU] = useState<any>([]);
    const [binIdDisabled, setBinIdDisabled] = useState<boolean>(true);
    const [isRobotMoving, setIsRobotMoving] = useState<boolean>(false);

    const ErrorAudio = new Audio(".../public/ErrorSound.mp3");

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
            name: "aurmr_demo/stow",
            serviceType: "/aurmr_tasks/StowRequest"
        }));
    }



    let binList: string[] = [];
    let binInfoList: any[] = [];
    let prodList: string[] = [];

    const { data: BinData, loading: BinLoading, error: BinError } = useQuery(GET_ALL_BINS);
    const { data: prodData, loading: prodLoading, error: prodError } = useQuery(GET_ALL_PROD);
    const [add_prod_to_bin, { data: addProdToBinData, loading: addProdToBinLoading, error: addProdToBinError }] = useMutation(ADD_PROD_TO_BIN_FOR_AN_EVAL);
    const { data: evalData, loading: evalLoading, error: evalError, refetch: evalRefetch } = useQuery(GET_ONE_EVAL);
    const { data: eachBinData, loading: eachBinDataLoading, error: eachBinDataErrorLoading, refetch: prodInBinEvalRefetch } = useQuery(GET_PROD_IN_BIN_FOR_EVAL);
    const { data: eachBinIdData, loading: eachBinIdDataLoading, error: eachBinIdDataErrorLoading, refetch: prodInBinIdEvalRefetch } = useQuery(GET_PROD_IN_BIN_ID_FOR_EVAL);
    const { data: oneProdData, loading: oneProdLoading, error: oneProdError, refetch: oneProdRefetch } = useQuery(GET_ONE_PROD);
    const { data: OneBinData, loading: OneBinLoading, error: OneBinError, refetch: OneBinRefetch } = useQuery(GET_BIN_FROM_BINID);

    if ((BinLoading) || (prodLoading) || (evalLoading) || (eachBinDataLoading)) return <p>Loading...</p>;
    if (addProdToBinLoading) return <p>Submitting...</p>
    if (BinError) return <p>Error: {BinError.message}</p>
    if (prodError) return <p>Error: {prodError.message}</p>
    if (addProdToBinError) return <p>Error: {addProdToBinError.message}</p>
    // if (evalError) return <p>Error: {evalError.message}</p>


    for (let i = 0; i < Object.keys(BinData.getAllBins).length; i++) {
        binList.push(BinData.getAllBins[i].BinId);
        let totVol = 0;
        for (let j = 0; j < Object.keys(BinData.getAllBins[i].AmazonProducts).length; j++) {
            totVol += BinData.getAllBins[i].AmazonProducts[j].amazonProduct.size_length * BinData.getAllBins[i].AmazonProducts[j].amazonProduct.size_width * BinData.getAllBins[i].AmazonProducts[j].amazonProduct.size_height;
        }
        binInfoList.push(
            {
                "binId": BinData.getAllBins[i].BinId,
                "tableName": BinData.getAllBins[i].TableName,
                "binName": BinData.getAllBins[i].BinName,
                "depth": BinData.getAllBins[i].depth,
                "width": BinData.getAllBins[i].width,
                "height": BinData.getAllBins[i].height,
                "units": BinData.getAllBins[i].dimensions_units,
                "current_gcu": totVol / (BinData.getAllBins[i].depth * BinData.getAllBins[i].width * BinData.getAllBins[i].height),
                "current_volume_of_prods": totVol
            }
        );
    }

    for (let j = 0; j < Object.keys(prodData.getAllProducts).length; j++) {
        prodList.push(prodData.getAllProducts[j].asin)
    }

    const checkValidASIN = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setSubmitableProd(e.target.value);
        let asinErr: boolean = true;
        let getProdFromDB = (await oneProdRefetch({ asin: e.target.value }));
        if (getProdFromDB.data.getProduct.length != 0) {
            if (getProdFromDB.data.getProduct[0].size_units != "Unavailable") {
                console.log("true");
                setisAsinError(false);
                asinErr = false;
                setBinIdDisabled(false);
                refBin.current!.focus();
            } else {
                console.log("Product doesn't have size information in the DB.");
                setisAsinError(true);
                setBinIdDisabled(true);
                asinErr = true;
                return;
            }
        } else {
            console.log("Product doesn't exist.");
            setisAsinError(true);
            setBinIdDisabled(true);
            asinErr = true;
            return;
        }
        if (autoOrManual != "Manual") {
            submitIfComplete(asinErr, isBinError, e.target.value, submitableBin);
        }
    }

    const objOrientationChosen = (prodLen: number, prodWid: number, prodHt: number, binHt: number, binWid: number, binDepth: number, lenFromWid: number): number => {
        const binMatrix = matrix([
            [binHt, binWid - lenFromWid, binDepth],
            [binHt, binWid - lenFromWid, binDepth],
            [binHt, binWid - lenFromWid, binDepth],
            [binHt, binWid - lenFromWid, binDepth],
            [binHt, binWid - lenFromWid, binDepth],
            [binHt, binWid - lenFromWid, binDepth]
        ]);
        console.log(binMatrix);
        const prodMatrix = matrix([
            [prodLen, prodWid, prodHt],
            [prodLen, prodHt, prodWid],
            [prodWid, prodHt, prodLen],
            [prodHt, prodLen, prodWid],
            [prodHt, prodWid, prodLen],
            [prodWid, prodLen, prodHt]
        ])
        console.log(prodMatrix);
        let subtractedMatrix = subtract(binMatrix, prodMatrix);
        // let orientationLenChosen = 0;
        console.log(subtractedMatrix);
        let listOfOrientations: number[] = [];
        for (let i = 0; i < 6; i++) {
            let x = subtractedMatrix.get([i, 0]);
            let y = subtractedMatrix.get([i, 1]);
            let z = subtractedMatrix.get([i, 2]);
            if (x >= 0 && y >= 0 && z >= 0) {
                // orientationLenChosen = prodMatrix.get([i, 1]);
                listOfOrientations[listOfOrientations.length] = row(prodMatrix, i).get([0, 1]);
                // console.log(orientationLenChosen);
                // return orientationLenChosen;
            } else {
                if (x + 0.2 >= 0 && y + 0.2 >= 0 && z + 0.2 >= 0) {
                    listOfOrientations[listOfOrientations.length] = row(prodMatrix, i).get([0, 1]);
                }
            }
        }
        if (listOfOrientations.length == 0) {
            return -1;
        }
        return Math.min(...listOfOrientations);
    }

    const checkValidBin = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitableBin(e.target.value);
        let binListToCheck = [];
        let count = 0;
        let binErr: boolean = true;
        for (let i = 0; i < binInfoList.length; i++) {
            if (binInfoList[i]["tableName"] == tableName) {
                binListToCheck[count] = binInfoList[i]["binId"];
                count++;
            }
        }
        console.log(binListToCheck)
        if (binListToCheck.includes(e.target.value)) {
            console.log(tableName)
            let oneBinSpecific = await prodInBinIdEvalRefetch({ binId: e.target.value, tableName: tableName, evalName: submitableEvalName })
            console.log(oneBinSpecific);
            let oneBinDetails = await OneBinRefetch({ binId: e.target.value })
            console.log(oneBinDetails);
            let binDepth = oneBinDetails.data.getBinByBinId.depth;
            let binWidth = oneBinDetails.data.getBinByBinId.width;
            let binHeight = oneBinDetails.data.getBinByBinId.height;
            let volumeOfBin = binDepth * binHeight * binWidth;
            let volumeOfProds: number = 0;
            let lengthFromWidth: number = 0;
            for (let a = 0; a < oneBinSpecific.data.getAmazonProductFromBinIdEval.length; a++) {
                if (oneBinSpecific.data.getAmazonProductFromBinIdEval[a].amazonProduct.size_units != "Unavailable") {
                    let prodCurrHeight = parseFloat(oneBinSpecific.data.getAmazonProductFromBinIdEval[a].amazonProduct.size_height);
                    let prodCurrWidth = parseFloat(oneBinSpecific.data.getAmazonProductFromBinIdEval[a].amazonProduct.size_width);
                    let prodCurrLength = parseFloat(oneBinSpecific.data.getAmazonProductFromBinIdEval[a].amazonProduct.size_length);
                    volumeOfProds += prodCurrHeight * prodCurrWidth * prodCurrLength;

                    let choosedOrient = objOrientationChosen(prodCurrLength, prodCurrWidth, prodCurrHeight, binHeight, binWidth, binDepth, lengthFromWidth);

                    if (choosedOrient != -1) {
                        lengthFromWidth += choosedOrient;
                    }

                } else {
                    setisBinError(true);
                    setBinErrorMsg("Error: Bin Size is unavailabe in the DB");
                    binErr = true;
                    console.log("Error: Bin Size is unavailabe in the DB")
                    return;
                }
            }
            console.log(volumeOfProds);
            let newProdToAdd = (await oneProdRefetch({ asin: submitableProd })).data.getProduct[0];
            console.log(newProdToAdd);
            let newProdHeight = newProdToAdd.size_height;
            let newProdLength = newProdToAdd.size_length;
            let newProdWidth = newProdToAdd.size_width;
            let volumeOfNewProd = newProdHeight * newProdLength * newProdWidth;
            if (volumeOfProds + volumeOfNewProd > volumeOfBin - volumeOfProds) {
                setisBinError(true);
                binErr = true;
                console.log("Error: Volume will go above the available volume of the bin.")
                setBinErrorMsg("Error: Volume will go above the available volume of the bin.")
                return;
            } else {
                let newGCU = (volumeOfProds + volumeOfNewProd) / volumeOfBin;
                if (newGCU > parseFloat(maxBinGCU)) {
                    setisBinError(true);
                    binErr = true;
                    console.log("Error: The New GCU will go above the specified max GCU.")
                    setBinErrorMsg("Error: The New GCU will go above the specified max GCU.")
                    return;
                } else {
                    // Figure out the W - l value for the bin from the items that are currently present in the bin. 
                    if (objOrientationChosen(newProdLength, newProdWidth, newProdHeight, binHeight, binWidth, binDepth, lengthFromWidth) == -1) {
                        setisBinError(true);
                        binErr = true;
                        console.log("Error: The orientation doesn't fit in the bin.")
                        setBinErrorMsg("Error: The orientation doesn't fit in the bin.")
                        return;
                    } else {
                        setisBinError(false);
                        setBinErrorMsg("");
                        binErr = false;
                        console.log("No errors.");
                    }
                }
            }
        } else {
            setisBinError(true);
            binErr = true;
            console.log("Error: This bin Id doesn't exist in the pod (or incorrect binId).")
            setBinErrorMsg("Error: This bin Id doesn't exist in the pod (or incorrect binId).")
            ErrorAudio.play();
            return;
        }

        if (autoOrManual != "Manual") {
            submitIfComplete(isASINError, binErr, submitableProd, e.target.value);
        }
    }

    async function submitIfComplete(isasinError: boolean, isbinError: boolean, sProd: string, sBin: string) {
        console.log("entered submission")
        if (!isasinError && !isbinError && sProd != "" && sBin != "" && submitableEvalName != "") {
            //submit
            add_prod_to_bin({ variables: { asin: sProd, binId: sBin, evalName: submitableEvalName } })
            setSubmitMessage("Submit Successful: " + sProd + " inside " + sBin + " for " + submitableEvalName)
            console.log("submit: " + sProd + " inside " + sBin + " for " + submitableEvalName);
            setSubmitableProd("");
            setSubmitableBin("");
            setisAsinError(false);
            setisBinError(false);
            setBinErrorMsg("");
            refASIN.current!.focus();
            console.log(await evalRefetch({ evalName: submitableEvalName }));
            generateTable();
            sendRequestToRobot(submitableBin, submitableProd);
        }
    }

    function submitOnClick() {
        if (!isASINError && !isBinError && submitableProd != "" && submitableBin != "" && submitableEvalName != "") {
            add_prod_to_bin({ variables: { asin: submitableProd, binId: submitableBin, evalName: submitableEvalName } })
            setSubmitMessage("Submit Successful: " + submitableProd + " inside " + submitableBin + " for " + submitableEvalName)
            console.log("submit: " + submitableProd + " inside " + submitableBin + " for " + submitableEvalName);
            setSubmitableProd("");
            setSubmitableBin("");
            setisAsinError(false);
            setisBinError(false);
            setBinErrorMsg("");
            refASIN.current!.focus();
            generateTable();
            sendRequestToRobot(submitableBin, submitableProd);
        }
    }

    async function generateTableHelper(table: any) {
        let listOfRows: JSX.Element[] = [];
        let count: number = 0;
        let podVol: number = 0;
        let totalObjVol: number = 0;
        for (let i = table.rows; i >= 1; i--) {
            let listOfItems: JSX.Element[] = [];
            let binVol: number = 0;
            let rowVol: number = 0;
            for (let j = 1; j <= table.cols; j++) {
                let binName1: string = j + String.fromCharCode(64 + i);
                let binsize: string = "";
                let binsizeunits: string = "";
                for (let k = 0; k < binInfoList.length; k++) {
                    if (binInfoList[k]["binName"] == binName1 && binInfoList[k]["tableName"] == tableName) {
                        binsize = binInfoList[k]["width"] + " x " + binInfoList[k]["height"] + " x " + binInfoList[k]["depth"];
                        binsizeunits = binInfoList[k]["units"];
                    }
                }

                let prods = await prodInBinEvalRefetch({ evalName: submitableEvalName, binName: binName1, tableName: tableName });
                console.log(prods);
                let tempAmzList = [];
                let allObjVol: number = 0;
                for (let i = 0; i < Object.keys(prods.data.getAmazonProductFromBinEval).length; i++) {
                    let objVol = parseFloat(prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_length) * parseFloat(prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_width) * parseFloat(prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_height);

                    let prodAmz = {
                        "name": prods.data.getAmazonProductFromBinEval[i].amazonProduct.name,
                        "asin": prods.data.getAmazonProductFromBinEval[i].amazonProduct.asin,
                        "id": prods.data.getAmazonProductFromBinEval[i].id,
                        "size_length": prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_length,
                        "size_width": prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_width,
                        "size_height": prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_height,
                        "size_units": prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_units,
                        "object_volume": objVol,
                    }

                    allObjVol += objVol
                    tempAmzList.push(prodAmz);
                }

                let binsizevals: string[] = binsize.split(" x ");
                binVol = parseFloat(binsizevals[0]) * parseFloat(binsizevals[1]) * parseFloat(binsizevals[2]);
                rowVol += binVol;
                let binGCU: number = allObjVol / binVol;
                totalObjVol += allObjVol;

                for (let k = 0; k < binInfoList.length; k++) {
                    if (binInfoList[k]["binName"] == binName1 && binInfoList[k]["tableName"] == tableName) {
                        binInfoList[k]["current_gcu"] = parseFloat(binGCU.toString()).toFixed(2);
                        binInfoList[k]["current_volume_of_prods"] = allObjVol;
                    }
                }

                let tableData: JSX.Element =
                    <TableCell>
                        <p className="binLabel">{binName1}</p>
                        <p style={{ "backgroundColor": getGreenToRed(((parseFloat(parseFloat(binGCU.toString()).toFixed(2))) / (parseFloat(maxBinGCU))) * 100) }}>Bin GCU: {parseFloat(binGCU.toString()).toFixed(2)}</p>
                        <details>
                            {tempAmzList.length == 0 ? <summary>No Items.</summary> : <summary>Item List ({tempAmzList.length}): </summary>}
                            <p>Total Volume: {binsize} {binsizeunits} = {binVol} {binsizeunits}^3</p>
                            <Cell amazonProduct={tempAmzList} generateTable={generateTable}></Cell>
                        </details>
                    </TableCell>

                listOfItems[j - 1] = tableData;
            }
            podVol += rowVol;
            let tableRow: JSX.Element = <TableRow>{listOfItems}</TableRow>;
            listOfRows[count] = tableRow;
            count++;
        }
        setpodGCU(totalObjVol / podVol);
        let tableJSX: JSX.Element = <Table aria-label="a dense table">{listOfRows}</Table>;
        setTable1Actual(tableJSX);
        console.log(binInfoList);
    }

    async function generateTable() {
        if (submitableEvalName != "" && tableName == "1") {
            generateTableHelper(table1);
        } else if (submitableEvalName != "" && tableName == "2") {
            generateTableHelper(table2);
        }
    }

    function evalNameOnClick() {
        if (submitableEvalName != "") {
            setEvalNameDisabled(true);
            setEvalNameError(false);
        } else {
            setEvalNameError(true);
        }
    }

    function tableNameOnClick() {
        if (tableName != "") {
            setTableDisabled(true);
            setTableError(false);
        } else {
            setTableError(true);
        }

    }

    function maxBinGCUButton() {
        if (parseFloat(maxBinGCU) < 0 || parseFloat(maxBinGCU) > 1 || maxBinGCU == "") {
            setMaxBinGCUError(true);
        } else {
            setMaxBinGCUError(false);
            setMaxBinGCUDisabled(true);
        }
    }

    function onClickUndo() {
        setSubmitMessage("");
        setisAsinError(false);
        setisBinError(false);
        setSubmitableProd("");
        setSubmitableBin("");
        setBinErrorMsg("");
        setBinIdDisabled(true);
        refASIN.current!.focus();
    }

    function onClickReset() {
        setSubmitMessage("");
        setisAsinError(false);
        setisBinError(false);
        setBinErrorMsg("")
        setSubmitableProd("");
        setSubmitableBin("");
        setEvalNameDisabled(false);
        setEvalNameError(false);
        setSubmitableEvalName("");
        setTable1Actual(<table></table>);
        setTableName("");
        setTableError(false);
        setTableDisabled(false);
        setpodGCU(0);
        setMaxBinGCU("");
        setMaxBinGCUDisabled(false);
        setMaxBinGCUError(false);
        setBinIdDisabled(true);
        refASIN.current!.focus();
    }

    function getGreenToRed(percent: number) {
        let r: number = percent > 50 ? 255 : Math.floor((percent * 2) * 255 / 100);
        let g: number = percent < 50 ? 255 : Math.floor(255 - (percent * 2 - 100) * 255 / 100);
        return 'rgb(' + r + ',' + g + ',0)';
    }

    async function sendRequestToRobot(binId: string, prodBinId: string) {
        let binDetails = await OneBinRefetch({ binId: binId });
        let binName: string = binDetails.data.getBinByBinId.BinId;
        var request = new ROSLIB.ServiceRequest({
            bin_id: binName,
            object_id: prodBinId
        });
        console.log(robotServiceClient);
        setIsRobotMoving(true);
        if (!debug) {
            robotServiceClient.callService(request, function (result: boolean) {
                console.log("Received back from the Robot: " +
                    robotServiceClient.name +
                    ': ' +
                    result);
                setIsRobotMoving(false);
            });
        }        
    }

    return (
        <div id="overall">
            <h1>Manual Evaluation</h1>
            {isRobotMoving ?
                <div id="topStuff">
                    <p>Robot is moving. Please wait...</p>
                    {debug ? <Button onClick={() => setIsRobotMoving(false)}>Received Message</Button> : <br />}
                </div> :
                <div id="topStuff">
                    <p style={{ "display": "inline", "marginLeft": "15px" }}>Step 1: </p><Button disabled={isConnected} style={{ "display": "inline" }} variant="contained" id="connectToBot" onClick={connectToRos}>Connect to Robot</Button>
                    <div style={{ "display": "block", "margin": "15px" }}>

                        <p >Step 2: </p>
                        <FormControl id="evalName" error={evalNameError} variant="standard">
                            <FormLabel component="legend">Enter Evaluation Name (must be unique):</FormLabel>
                            <Input disabled={evalNameDisabled} error={evalNameError} onChange={(e) => setSubmitableEvalName(e.target.value)} value={submitableEvalName} id="evalNameForm" placeholder="Evaluation Name" />
                        </FormControl>
                        <Button variant="outlined" color="success" id="itemBinButton" onClick={evalNameOnClick}>Submit Evaluation Name</Button>
                    </div>

                    <div style={{ "display": "block", "margin": "15px" }}>
                        <p >Step 3: </p>
                        <FormControl error={tableError} disabled={tableDisabled}>
                            <FormLabel component="legend">Pick a Pod</FormLabel>
                            <RadioGroup value={tableName} row>
                                <FormControlLabel
                                    control={
                                        <Radio onChange={(e) => setTableName("1")} value="1" name="1" />
                                    }
                                    label="Pod 1 (6-inch)"
                                />
                                <FormControlLabel
                                    control={
                                        <Radio onChange={(e) => setTableName("2")} value="2" name="2" />
                                    }
                                    label="Pod 2 (14-inch)"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox disabled name="3" />
                                    }
                                    label="Pod 3"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox disabled name="4" />
                                    }
                                    label="Pod 4"
                                />
                                <Button variant="outlined" color="success" onClick={tableNameOnClick}>Submit Pod Choice</Button>
                            </RadioGroup>
                        </FormControl>
                    </div>

                    <div style={{ "display": "block", "margin": "15px" }}>
                        <p >Step 4: </p>
                        <FormControl id="evalName" error={evalNameError} variant="standard">
                            <FormLabel component="legend">Enter Maximum Bin GCU:</FormLabel>
                            <Input disabled={maxBinGCUDisabled} error={maxBinGCUError} onChange={(e) => setMaxBinGCU(e.target.value)} value={maxBinGCU} placeholder="Max Bin GCU" />
                        </FormControl>
                        <Button variant="outlined" color="success" onClick={maxBinGCUButton}>Submit Max Bin GCU</Button>
                    </div>

                    {submitMessage != "" ? <p className="submitMessagebox">{submitMessage}</p> : <p></p>}

                    {binErrorMsg != "" ? <p className="errorMsg">{binErrorMsg}</p> : <p></p>}

                    <div style={{ "display": "block", "margin": "15px" }}>
                        <p >Step 5: </p>
                        <FormControl>
                            <FormLabel id="demo-radio-buttons-group-label">Method of Input</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="Automatic"
                                value={autoOrManual}
                                name="radio-buttons-group"
                                onChange={(e) => setAutoOrManual(e.target.value)}
                            >
                                <FormControlLabel value="Automatic" control={<Radio />} label="Automatic" />
                                <FormControlLabel value="Manual" control={<Radio />} label="Manual" />
                            </RadioGroup>
                        </FormControl>

                        {autoOrManual == "Automatic" ?
                            <div id="leftForm">
                                <FormLabel component="legend">Enter Automatically:</FormLabel>
                                <FormControl id="itemInput" error={isASINError} variant="standard">
                                    <InputLabel htmlFor="itemASIN">Item ASIN</InputLabel>
                                    <Input autoFocus={true} inputRef={refASIN} onChange={checkValidASIN} value={submitableProd} error={isASINError} id="itemASIN" placeholder="Item ASIN" />
                                </FormControl>

                                <FormControl id="binInput" error={isBinError} variant="standard">
                                    <InputLabel htmlFor="itemASIN">Bin Id</InputLabel>
                                    <Input inputRef={refBin} onChange={checkValidBin} error={isBinError} value={submitableBin} id="binid" placeholder="Bin Id" />
                                </FormControl>
                                <div>
                                    <Button variant="contained" id="submitEvalButton" color="warning" style={{ "display": "inline", "margin": "10px" }} onClick={onClickUndo}>Undo</Button>
                                    <Button variant="contained" id="submitEvalButton" color="error" style={{ "display": "inline", "margin": "10px" }} onClick={onClickReset}>Reset</Button>
                                </div>
                            </div>
                            :
                            <div id="rightForm">
                                <FormLabel component="legend">Enter Manually:</FormLabel>
                                <FormControl id="itemInput" error={isASINError} variant="standard">
                                    <InputLabel htmlFor="itemASIN">Item ASIN</InputLabel>
                                    <Input autoFocus={true} inputRef={refASIN} onChange={checkValidASIN} value={submitableProd} error={isASINError} id="itemASIN" placeholder="Item ASIN" />
                                </FormControl>

                                <FormControl id="binInput" error={isBinError} variant="standard">
                                    <InputLabel htmlFor="itemASIN">Bin Id</InputLabel>
                                    <Input disabled={binIdDisabled} inputRef={refBin} onChange={checkValidBin} value={submitableBin} error={isBinError} id="binid" placeholder="Bin Id" />
                                </FormControl>
                                <Button variant="outlined" color="success" id="itemBinButton" onClick={submitOnClick}>Add Item</Button>

                                <div>
                                    <Button variant="contained" id="submitEvalButton" color="warning" style={{ "display": "inline", "margin": "10px" }} onClick={onClickUndo}>Undo</Button>
                                    <Button variant="contained" id="submitEvalButton" color="error" style={{ "display": "inline", "margin": "10px" }} onClick={onClickReset}>Reset</Button>
                                </div>
                            </div>
                        }

                    </div>

                    <p style={{ "color": "red" }}>Remember your evaluation name: {submitableEvalName}</p>
                </div>
            }
            <FormGroup row style={{ "marginTop": "20px" }}>
                <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                    onClick={() => generateTable()}
                >
                    Generate
                </LoadingButton>
            </FormGroup>
            <h3>Pod GCU: {parseFloat(podGCU.toString()).toFixed(3)}</h3>
            {table1Actual}
        </div>

    )
}

export default ManualEval;