import React, { Component } from 'react';
import Cell from './Cell';

interface ManualEvalProps {

}

interface ManualEvalState {
    rows: JSX.Element[]
    cols: JSX.Element[]
}

class ManualEval extends Component<ManualEvalProps, ManualEvalState> {
    readonly NUM_ROWS: number = 4;
    readonly NUM_COLS: number = 4;

    constructor(props: any) {
        super(props);
        this.state = {
            rows: [],
            cols: []
        };
    }

    async getTableRows() {
        let tableRows: JSX.Element[] = [];
        let tableCols: JSX.Element[] = [];
        for (let i = 0; i < this.NUM_COLS; i++) {
            tableCols[i] = <td><Cell key={i} /></td>
        }
        for (let i = 0; i < tableCols.length; i++) {
            tableRows[i] = <tr>{tableCols}</tr>
        }
        this.setState({
            cols: tableCols,
            rows: tableRows
        });
    }

    render() {
        return (
            <div>
                <h1>Manual Evaluation</h1>
                <button onClick = {() => this.getTableRows()}>Generate</button>
                {this.state.rows}
            </div>

        )
    }
}

export default ManualEval;