import React, { Component, useEffect, useState } from 'react';
import '../styles/Cell.css';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';

import AddIcon from '@mui/icons-material/Add';

interface CellProps {
    amazonProduct: string[]
}

interface CellState {
    binId: string
    products: string[]
    actualProds: JSX.Element[]
}


function Cell(props: any) {
    return (
        <div id="overall2">
            <ul>
                {props.amazonProduct.map((item: any, i: number) => {
                    return <li key={i}><Button><SvgIcon component={DeleteIcon} /></Button>{item["name"]}</li>
                })}
            </ul>
        </div>
    )
}

export default Cell;