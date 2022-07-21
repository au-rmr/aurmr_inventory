import React, { Component } from 'react';
import '../styles/Cell.css';

interface CellProps {

}

interface CellState {
    binId: string
    products: string[]
}

class Cell extends Component<CellProps, CellState> {
    render() {
        return (
            <div id="overall">
                <p>Add an Amazon Product</p>
                <form>
                    <input type="text" placeholder='Enter the ASIN id for a product you wish to add.'/>
                    <button>Update</button>
                </form>
            </div>
        )
    }
}

export default Cell;