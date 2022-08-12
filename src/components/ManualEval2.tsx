import React, { Component, useState } from 'react';
import "../styles/ManualEval.css";
import { useRef } from 'react';

import Bin from "./Bin";

import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { GET_ALL_BINS } from '../GraphQLQueriesMuts/Query';
import { GET_ALL_PROD } from '../GraphQLQueriesMuts/Query';
import { GET_ONE_BIN_BY_TABLE_BINNAME } from '../GraphQLQueriesMuts/Query';
import { ADD_PROD_TO_BIN_FOR_AN_EVAL } from '../GraphQLQueriesMuts/Mutation';
import { GET_ONE_EVAL } from '../GraphQLQueriesMuts/Query';

import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from "@mui/material/Radio";

import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';




function ManualEval2(props: any) {
    const table1 = {
        name: "1",
        rows: 13,
        cols: 4
    }

    const table2 = {
        name: "2",
        rows: 8,
        cols: 3
    }

    const [loading, setLoading] = useState<boolean>(false);

    const [evalNameDisabled, setEvalNameDisabled] = useState<boolean>(false);
    const [evalNameError, setEvalNameError] = useState<boolean>(false);
    const [submitableEvalName, setSubmitableEvalName] = useState<string>("");

    const [tableName, setTableName] = useState<string>("");
    const [tableError, setTableError] = useState<boolean>(false);
    const [tableDisabled, setTableDisabled] = useState<boolean>(false);

    const [autoOrManual, setAutoOrManual] = useState<string>("Automatic");

    const [isASINError, setisAsinError] = useState<boolean>(false);
    const refASIN = useRef<HTMLInputElement>(null);

    const [isBinError, setisBinError] = useState<boolean>(false);
    const refBin = useRef<HTMLInputElement>(null);

    const [submitableProd, setSubmitableProd] = useState<string>("");

    const [submitableBin, setSubmitableBin] = useState<string>("");
    const [binIdDisabled, setBinIdDisabled] = useState<boolean>(true);

    const [submitMessage, setSubmitMessage] = useState<string>("");

    const [tableActual, setTableActual] = useState<JSX.Element>(<table></table>);

    const { data: BinData, loading: BinLoading, error: BinError } = useQuery(GET_ALL_BINS);
    const { data: prodData, loading: prodLoading, error: prodError } = useQuery(GET_ALL_PROD);
    const { data: OneBinData, loading: OneBinLoading, error: OneBinError, refetch: OneBinRefetch } = useQuery(GET_ONE_BIN_BY_TABLE_BINNAME);
    const [add_prod_to_bin, { data: addProdToBinData, loading: addProdToBinLoading, error: addProdToBinError }] = useMutation(ADD_PROD_TO_BIN_FOR_AN_EVAL);
    const { data: evalData, loading: evalLoading, error: evalError, refetch: evalRefetch } = useQuery(GET_ONE_EVAL);

    if (prodLoading) return <p>Loading...</p>;
    if (prodError) return <p>Error: {prodError.message}</p>

    let prodList: string[] = [];
    let binList: string[] = [];
    let binInfoList: any[] = [];

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

    const checkValidASIN = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setSubmitableProd(e.target.value);
        let asinErr: boolean = true;
        if (prodList.includes(e.target.value)) {
            console.log("true");
            setisAsinError(false);
            asinErr = false;
            refBin.current!.focus();
            setBinIdDisabled(false);
        } else {
            console.log("false");
            setisAsinError(true);
            setBinIdDisabled(true);
            asinErr = true;
        }
        if (autoOrManual != "Manual") {
            submitIfComplete(asinErr, isBinError, e.target.value, submitableBin);
        }
    }
    

    const checkValidBin = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubmitableBin(e.target.value);
        let binListToCheck = [];
        let count = 0;
        let binErr: boolean = true;
        for (let i = 0; i < binList.length; i++) {
            binListToCheck[count] = binList[i];
            count++;
        }
        if (binListToCheck.includes(e.target.value)) {
            setisBinError(false);
            binErr = false;
        } else {
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
    }

    async function generateTableHelper(table: any) {
        var convert = require('convert-units');
        console.log(convert(1).from('in').to('in'));
        let listOfRows: JSX.Element[] = [];
        let count: number = 0;
        for (let i = table.rows; i >= 1; i--) {
            let listOfItems: JSX.Element[] = [];
            for (let j = 1; j <= table.cols; j++) {
                let binName: string = j + String.fromCharCode(64 + i);
                let oneBinData = await OneBinRefetch({binName: binName, tableName: "" + table.name + ""})
                let thisBinVol: number = oneBinData.data.getBinByBinNameTable.depth * oneBinData.data.getBinByBinNameTable.width * oneBinData.data.getBinByBinNameTable.height;
                let tableData: JSX.Element = <TableCell><Bin 
                    binNameProp={binName} 
                    podNameProp={table.name} 
                    evalNameProp={submitableEvalName} 
                    binTotalAvailableVolume={thisBinVol}
                    binDepth={oneBinData.data.getBinByBinNameTable.depth}
                    binWidth={oneBinData.data.getBinByBinNameTable.width}
                    binHeight={oneBinData.data.getBinByBinNameTable.height}
                    binUnits={oneBinData.data.getBinByBinNameTable.dimensions_units}
                    />
                </TableCell>
                listOfItems[j - 1] = tableData;
            }
            listOfRows[count] = <TableRow>{listOfItems}</TableRow>;
            count++;
        }
        setTableActual(<Table>{listOfRows}</Table>);
    }

    async function generateTable() {
        if (submitableEvalName != "" && tableName == "1") {
            generateTableHelper(table1);
        } else if (submitableEvalName != "" && tableName == "2") {
            generateTableHelper(table2);
        }
    }

    return (
        <div id="overall">
            <h1>Manual Evaluation 2.0</h1>
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
                            <Button variant="outlined" color="success" onClick={tableNameOnClick}>Submit Table Choice</Button>
                        </RadioGroup>
                    </FormControl>
                </div>

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
                                <Input inputRef={refBin} disabled={binIdDisabled} onChange={checkValidBin} error={isBinError} value={submitableBin} id="binid" placeholder="Bin Id" />
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
                                <Input inputRef={refBin} disabled={binIdDisabled} onChange={checkValidBin} value={submitableBin} error={isBinError} id="binid" placeholder="Bin Id" />
                            </FormControl>
                            <Button variant="outlined" color="success" id="itemBinButton" onClick={submitOnClick}>Add Item</Button>
                        </div>
                    }
                </div>
            </div>

            <div>
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
                {tableActual}
            </div>


        </div>

    )
}

export default ManualEval2;
