import React, { Component, useState } from 'react';
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
import { JsxEmit } from 'typescript';

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

interface ManualEvalProps {

}

interface ManualEvalState {
    rows: JSX.Element[]
    cols: JSX.Element[]
}

function ManualEval(props: any) {
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

    let binList: string[] = [];
    let binInfoList: any[] = [];
    let prodList: string[] = [];

    const { data: BinData, loading: BinLoading, error: BinError } = useQuery(GET_ALL_BINS);
    const { data: prodData, loading: prodLoading, error: prodError } = useQuery(GET_ALL_PROD);
    const [add_prod_to_bin, { data: addProdToBinData, loading: addProdToBinLoading, error: addProdToBinError }] = useMutation(ADD_PROD_TO_BIN_FOR_AN_EVAL);
    const { data: evalData, loading: evalLoading, error: evalError, refetch: evalRefetch } = useQuery(GET_ONE_EVAL);
    const { data: eachBinData, loading: eachBinDataLoading, error: eachBinDataErrorLoading, refetch: prodInBinEvalRefetch } = useQuery(GET_PROD_IN_BIN_FOR_EVAL);

    if ((BinLoading) || (prodLoading) || (evalLoading) || (eachBinDataLoading)) return <p>Loading...</p>;
    if (addProdToBinLoading) return <p>Submitting...</p>
    if (BinError) return <p>Error: {BinError.message}</p>
    if (prodError) return <p>Error: {prodError.message}</p>
    if (addProdToBinError) return <p>Error: {addProdToBinError.message}</p>
    // if (evalError) return <p>Error: {evalError.message}</p>


    for (let i = 0; i < Object.keys(BinData.getAllBins).length; i++) {
        binList.push(BinData.getAllBins[i].BinId);
        binInfoList.push(
            {
                "binId": BinData.getAllBins[i].BinId,
                "tableName": BinData.getAllBins[i].TableName,
                "binName": BinData.getAllBins[i].BinName,
                "depth": BinData.getAllBins[i].depth,
                "width": BinData.getAllBins[i].width,
                "height": BinData.getAllBins[i].height,
                "units": BinData.getAllBins[i].dimensions_units
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
        if (prodList.includes(e.target.value)) {
            console.log("true");
            setisAsinError(false);
            asinErr = false;
            refBin.current!.focus();
        } else {
            console.log("false");
            setisAsinError(true);
            asinErr = true;
        }
        if (autoOrManual != "Manual") {
            submitIfComplete(asinErr, isBinError, e.target.value, submitableBin);
        }
    }

    const checkValidBin = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setSubmitableBin(e.target.value);
        let binErr: boolean = true;
        let tableRelatedBin: string[] = [];
        for (let i = 0; i < binInfoList.length; i++) {
            if (binInfoList[i]["tableName"] == tableName) {
                tableRelatedBin.push(binInfoList[i]["binId"]);
            }
        }
        if (tableRelatedBin.includes(e.target.value)) {
            console.log("true");
            setisBinError(false);
            binErr = false;
        } else {
            console.log("false");
            setisBinError(true);
            binErr = true;
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
            refASIN.current!.focus();
            console.log(await evalRefetch({ evalName: submitableEvalName }));
            generateTable();
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
            refASIN.current!.focus();
            generateTable();
        }
    }

    async function generateTableHelper(table: any) {
        let listOfRows: JSX.Element[] = [];
        let count: number = 0;
        for (let i = table.rows; i >= 1; i--) {
            let listOfItems: JSX.Element[] = [];
            let podVol: number = 0;
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
                let binVol: number = parseFloat(binsizevals[0]) * parseFloat(binsizevals[1]) * parseFloat(binsizevals[2]);
                let binGCU: number = allObjVol / binVol;
                podVol += binVol;

                let tableData: JSX.Element = <TableCell><p>{binName1}</p><p>Total Volume: {binsize} {binsizeunits} = {binVol} {binsizeunits}^3</p><p>Bin GCU: {parseFloat(binGCU.toString()).toFixed(2)}</p><Cell amazonProduct={tempAmzList} generateTable={generateTable}></Cell></TableCell>
                listOfItems[j - 1] = tableData;
            }
            let tableRow: JSX.Element = <TableRow>{listOfItems}</TableRow>;
            listOfRows[count] = tableRow;
            count++;
        }
        let tableJSX: JSX.Element = <Table>{listOfRows}</Table>;
        setTable1Actual(tableJSX);
    }

    async function generateTable() {
        if (submitableEvalName != "" && tableName == "1") {
            generateTableHelper(table1);
        } else if (submitableEvalName != "" && tableName == "2") {
            generateTableHelper(table2);
            // let listOfRows: JSX.Element[] = [];
            // let count: number = 0;
            // for (let i = table2.rows; i >= 1; i--) {
            //     let listOfItems: JSX.Element[] = [];
            //     for (let j = 1; j <= table2.cols; j++) {
            //         let binName1: string = j + String.fromCharCode(64 + i);
            //         let binsize: string = "";
            //         for (let k = 0; k < binInfoList.length; k++) {
            //             if (binInfoList[k]["binName"] == binName1 && binInfoList[k]["tableName"] == tableName) {
            //                 binsize = binInfoList[k]["width"] + " x " + binInfoList[k]["height"] + " x " + binInfoList[k]["depth"];
            //             }
            //         }
            //         let prods = await prodInBinEvalRefetch({ evalName: submitableEvalName, binName: binName1, tableName: tableName });
            //         console.log(prods);
            //         let tempAmzList = [];
            //         for (let i = 0; i < Object.keys(prods.data.getAmazonProductFromBinEval).length; i++) {
            //             let prodAmz = {
            //                 "name": prods.data.getAmazonProductFromBinEval[i].amazonProduct.name,
            //                 "asin": prods.data.getAmazonProductFromBinEval[i].amazonProduct.asin,
            //                 "id": prods.data.getAmazonProductFromBinEval[i].id,
            //                 "size_length": prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_length,
            //                 "size_width": prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_width,
            //                 "size_height": prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_height,
            //                 "size_units": prods.data.getAmazonProductFromBinEval[i].amazonProduct.size_units,
            //             }
            //             tempAmzList.push(prodAmz);
            //         }
            //         console.log(tempAmzList);
            //         let tableData: JSX.Element = <TableCell><p>{binName1}</p><p>Total Volume: {binsize}</p><Cell amazonProduct={tempAmzList} generateTable={generateTable}></Cell></TableCell>
            //         listOfItems[j - 1] = tableData;
            //     }
            //     let tableRow: JSX.Element = <TableRow>{listOfItems}</TableRow>;
            //     listOfRows[count] = tableRow;
            //     count++;
            // }
            // let tableJSX: JSX.Element = <Table>{listOfRows}</Table>;
            // setTable1Actual(tableJSX);
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

    return (
        <div id="overall">
            <h1>Manual Evaluation</h1>
            <div id="topStuff">
                <div style={{ "display": "block", "margin": "15px" }}>
                    <FormControl id="evalName" error={evalNameError} variant="standard">
                        <FormLabel component="legend">Enter Evaluation Name (must be unique):</FormLabel>
                        <Input disabled={evalNameDisabled} error={evalNameError} onChange={(e) => setSubmitableEvalName(e.target.value)} value={submitableEvalName} id="evalNameForm" placeholder="Evaluation Name" />
                    </FormControl>
                    <Button variant="outlined" color="success" id="itemBinButton" onClick={evalNameOnClick}>Submit Evaluation Name</Button>
                </div>

                <div style={{ "display": "block", "margin": "15px" }}>
                    <FormControl error={tableError} disabled={tableDisabled}>
                        <FormLabel component="legend">Pick a table</FormLabel>
                        <RadioGroup value={tableName} row>
                            <FormControlLabel
                                control={
                                    <Radio onChange={(e) => setTableName("1")} value="1" name="1" />
                                }
                                label="Table 1 (6-inch)"
                            />
                            <FormControlLabel
                                control={
                                    <Radio onChange={(e) => setTableName("2")} value="2" name="2" />
                                }
                                label="Table 2 (14-inch)"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox disabled name="3" />
                                }
                                label="Table 3"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox disabled name="4" />
                                }
                                label="Table 4"
                            />
                            <Button variant="outlined" color="success" id="itemBinButton" onClick={tableNameOnClick}>Submit Table Choice</Button>
                        </RadioGroup>
                    </FormControl>
                </div>

                {submitMessage != "" ? <p className="submitMessagebox">{submitMessage}</p> : <p></p>}

                <div style={{ "display": "block", "margin": "15px" }}>
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
                                <Input inputRef={refBin} onChange={checkValidBin} value={submitableBin} error={isBinError} id="binid" placeholder="Bin Id" />
                            </FormControl>
                            <Button variant="outlined" color="success" id="itemBinButton" onClick={submitOnClick}>Add Item</Button>
                        </div>
                    }
                </div>
                <Button variant="contained" id="submitEvalButton" >Submit Evaluation {submitableEvalName}</Button>
            </div>
            <FormGroup row>
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
            <h3>Pod GCU: </h3>
            {table1Actual}
        </div>

    )
}

export default ManualEval;