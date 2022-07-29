import React, { Component } from 'react';
import '../styles/Cell.css';
import {Link} from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';

interface CellProps {
    amazonProduct: String
}

interface CellState {
    binId: string
    products: string[]
}

class Cell extends Component<CellProps, CellState> {
    render() {
        return (
            <div id="overall2">
                <p>{this.props.amazonProduct}</p>
            </div>
        )
    }
}

export default Cell;