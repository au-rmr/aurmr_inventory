import React, { Component, useEffect, useState } from 'react';
import '../styles/Cell.css';

import { useLazyQuery, useQuery, useMutation } from '@apollo/client';
import { DELETE_PROD_FROM_BIN_FOR_AN_EVAL } from '../GraphQLQueriesMuts/Mutation';

import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import AddIcon from '@mui/icons-material/Add';

interface CellProps {
    amazonProduct: any;
    generateTable: () => void;
}

interface CellState {
    binId: string
    products: string[]
    actualProds: JSX.Element[]
}


function Cell({amazonProduct, generateTable}: CellProps) {
    const [del_prod_from_bin, { data: delProdFromBinData, loading: delProdFromBinLoading, error: delProdFromBinError }] = useMutation(DELETE_PROD_FROM_BIN_FOR_AN_EVAL);

    function handleDelete(idArg: string) {
        console.log(idArg);
        del_prod_from_bin({ variables: { id: idArg} });
        generateTable();
    }

    return (
        <div id="overall2">
            <ul>
                {amazonProduct.map((item: any, i: number) => {
                    return <li key={i}>
                        <Button onClick={() => handleDelete(item["id"])}><SvgIcon component={DeleteIcon} /></Button>{item["name"]}
                        <p>{item["size_length"]} x {item["size_width"]} x {item["size_height"]} {item["size_units"]}</p>
                    </li>
                })}
            </ul>
        </div>
    )
}

export default Cell;