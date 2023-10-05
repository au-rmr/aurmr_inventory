import React, { Component, useEffect, useState } from 'react';
import '../styles/Cell.css';

import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { DELETE_PROD_FROM_BIN_FOR_AN_EVAL, UPDATE_AMAZON_PRODUCT } from '../GraphQLQueriesMuts/Mutation';

import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';


import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

interface CellProps {
    amazonProduct: any;
    generateTable: () => void;
}

interface CellState {
    binId: string
    products: string[]
    actualProds: JSX.Element[],
    editModalOpen: any,
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


function Cell({ amazonProduct, generateTable }: CellProps) {
    const [del_prod_from_bin, { data: delProdFromBinData, loading: delProdFromBinLoading, error: delProdFromBinError }] = useMutation(DELETE_PROD_FROM_BIN_FOR_AN_EVAL);
    const [update_amazon_product, { data: updateAmazonProductData, loading: updateAmazonProductLoading, error: updateAmazonProductError }] = useMutation(UPDATE_AMAZON_PRODUCT);

    const [editModalOpen, setEditModalOpen] = useState<any>("");
    const [editItemASIN, setEditItemASIN] = useState<string>("");
    const [editItemName, setEditItemName] = useState<string>("");
    const [editItemLength, setEditItemLength] = useState<string>("");
    const [editItemWidth, setEditItemWidth] = useState<string>("");
    const [editItemHeight, setEditItemHeight] = useState<string>("");
    const [editItemUnits, setEditItemUnits] = useState<string>("");
    const [editItemWeight, setEditItemWeight] = useState<string>("");
    const [editItemWeightUnits, setEditItemWeightUnits] = useState<string>("");

    
    console.log('amazonProduct:');
    console.log(amazonProduct);

    function handleDelete(idArg: string) {
        console.log(idArg);
        del_prod_from_bin({ variables: { id: idArg } });
        generateTable();
    }

    function handleEdit(idArg: string) {
        const item = amazonProduct.filter((it: any) => it["id"] == idArg)[0];
        setEditModalOpen("true");
        setEditItemASIN(item["asin"]);
        setEditItemName(item["name"]);
        setEditItemLength(item["size_length"]);
        setEditItemWidth(item["size_width"]);
        setEditItemHeight(item["size_height"]);
        setEditItemUnits(item["size_units"]);
        setEditItemWeight(item["weight"]);
        setEditItemWeightUnits(item["weight_units"]);
    }

    function handleModalClose() {
        setEditModalOpen("");
        setEditItemASIN("");
        setEditItemName("");
        setEditItemLength("");
        setEditItemWidth("");
        setEditItemHeight("");
        setEditItemUnits("");
        setEditItemWeight("");
        setEditItemWeightUnits("");
    }

    return (
        <div >
            <ul id="overall2">
                {amazonProduct.map((item: any, i: number) => {
                    return <li className="itemProd" key={i}>

                        <Button onClick={() => handleDelete(item["id"])}><SvgIcon component={DeleteIcon} /></Button><Button onClick={() => handleEdit(item["id"])}><SvgIcon component={EditIcon} /></Button>
                        <p>{item["name"]}</p>
                        <p>Item Volume: {item["size_length"]} x {item["size_width"]} x {item["size_height"]} {item["size_units"]} = {parseFloat(item["object_volume"]).toFixed(2)} {item["size_units"]}^3</p>
                        

                    </li>
                })}
            </ul>
            <Modal
                open={editModalOpen != ""}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                {updateAmazonProductLoading ? <p>Saving...</p> : 
                (updateAmazonProductError ? <p>{updateAmazonProductError.message}</p> : (
                    <>
                    <h1>Edit Item</h1>
                    <FormControl id="editItemNameInput"  variant="standard">
                        <InputLabel htmlFor="editItemNameInput">Item Name</InputLabel>
                        <Input onChange={(e) => setEditItemName(e.target.value)} value={editItemName} id="editItemName" placeholder="Item Name" />
                    </FormControl>
                    <FormControl id="editItemLengthInput" variant="standard">
                        <InputLabel htmlFor="editItemLengthInput">Length</InputLabel>
                        <Input onChange={(e) => setEditItemLength(e.target.value)} value={editItemLength} id="editItemLength" placeholder="Length" />
                    </FormControl>
                    <FormControl id="editItemWidthInput" variant="standard">
                        <InputLabel htmlFor="editItemWidthInput">Width</InputLabel>
                        <Input onChange={(e) => setEditItemWidth(e.target.value)} value={editItemWidth} id="editItemWidth" placeholder="Width" />
                    </FormControl>
                    <FormControl id="editItemHeightInput" variant="standard">
                        <InputLabel htmlFor="editItemHeightInput">Height</InputLabel>
                        <Input onChange={(e) => setEditItemHeight(e.target.value)} value={editItemHeight} id="editItemHeight" placeholder="Height" />
                    </FormControl>
                    <FormControl id="editItemUnitsInput" variant="standard">
                        <InputLabel htmlFor="editItemUnitsInput">Units</InputLabel>
                        <Input onChange={(e) => setEditItemUnits(e.target.value)} value={editItemUnits} id="editItemUnits" placeholder="Units" />
                    </FormControl>
                    <FormControl id="editItemWeightInput" variant="standard">
                        <InputLabel htmlFor="editItemWeightInput">Weight</InputLabel>
                        <Input onChange={(e) => setEditItemWeight(e.target.value)} value={editItemWeight} id="editItemWeight" placeholder="Weight" />
                    </FormControl>
                    <FormControl id="editItemWeightUnitsInput" variant="standard">
                        <InputLabel htmlFor="editItemWeightUnitsInput">Weight Units</InputLabel>
                        <Input onChange={(e) => setEditItemWeightUnits(e.target.value)} value={editItemWeightUnits} id="editItemWeightUnits" placeholder="Weight Units" />
                    </FormControl>
                    <Button onClick={async () => {
                        if (editItemASIN == "") {
                            alert("ASIN cannot be empty");
                            return;
                        }
                        if (editItemName == "") {
                            alert("Name cannot be empty");
                            return;
                        }
                        if (editItemLength == "") {
                            alert("Length cannot be 0");
                            return;
                        }
                        if (editItemWidth == "") {
                            alert("Width cannot be 0");
                            return;
                        }
                        if (editItemHeight == "") {
                            alert("Height cannot be 0");
                            return;
                        }
                        if (editItemUnits == "") {
                            alert("Units cannot be empty");
                            return;
                        }
                        if (editItemWeight == "") {
                            alert("Weight cannot be 0");
                            return;
                        }
                        if (editItemWeightUnits == "") {
                            alert("Weight Units cannot be empty");
                            return;
                        }
                        console.log({variables: {
                            asin: editItemASIN,
                            name: editItemName,
                            size_length: editItemLength,
                            size_width: editItemWidth,
                            size_height: editItemHeight,
                            size_units: editItemUnits,
                            weight: editItemWeight,
                            weight_units: editItemWeightUnits,
                            attributes: []
                        }})
                        let result = update_amazon_product({variables: {
                            asin: editItemASIN,
                            name: editItemName,
                            size_length: parseFloat(editItemLength),
                            size_width: parseFloat(editItemWidth),
                            size_height: parseFloat(editItemHeight),
                            size_units: editItemUnits,
                            weight: parseFloat(editItemWeight),
                            weight_units: editItemWeightUnits,
                            attributes: []
                        }});
                        console.log(result);
                        generateTable();
                        handleModalClose();
                    }} variant="contained" color="success">
                        Save
                    </Button>
                    <Button onClick={handleModalClose} variant="outlined" color="error">
                        Cancel
                    </Button>
                    </>
                ))}
                </Box>
            </Modal>
        </div>
    )
}

export default Cell;