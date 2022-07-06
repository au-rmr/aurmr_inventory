import './../styles/App.css';
import React, {Component} from 'react';
import _ from 'lodash';

interface TableProps {
    numObjects: number;
    objectList:string[];
}

interface TableState {
    tableContents: string[]
}

const binDimensions = [13, 4];
class Table extends Component<TableProps, TableState>{
    constructor(props: any) {
        super(props);
        this.state = {
            tableContents: []
        };
    }

    getRandomObjectsFromList(n: any, objects: string[]) {
        let output: any[] = [];
        for (let i = 0; i < n; i++) {
            output.push(_.sample(objects));
        }
        return output;
    }

    randomlyAssignObjects() {
        let numBins = binDimensions[0] * binDimensions[1];
        let numObjectsCopy = this.props.numObjects;
        let evenSplit: number[] = [];
        let contents: string[][] = [[]];

        while(numObjectsCopy > 0) {
            const truncatedDivision = Math.floor(numObjectsCopy/numBins);
            evenSplit.push(truncatedDivision);
            numObjectsCopy -= truncatedDivision;
            numBins--;
        }
        numObjectsCopy = this.props.numObjects;

        for (let i = 0; i < numObjectsCopy; i++) {
            let x = Math.floor(Math.random() * evenSplit.length);
            contents.push(this.getRandomObjectsFromList(evenSplit[x], this.props.objectList));
            evenSplit.splice(x, 1);
        }
        contents.splice(0,1);

        return contents;
    }

    makeTable = () => {
        const contents: string[][] = this.randomlyAssignObjects();
        let output = "<style> table, th, td { border:1px solid black; border-radius: 5px; padding: 5px;} .center {margin-left: auto; " +
            "margin-right: auto; font-family:sans-serif; }</style><table class='center'>";
        for (let i = 0 ; i < binDimensions[0] ; i++) {
            output += "<tr>";
            for (let j = 0 ; j < binDimensions[1] ; j++) {
                output += "<td>" + contents[(i*binDimensions[1])+(j)] + "</td>";
            }
            output += "</tr>";
        }
        output += "</table>";

        return output;
    }

    render() {
        return (
            <>
                <div id="" dangerouslySetInnerHTML={{__html:  this.makeTable()}}/>

            </>
        );
    }
}
export default Table;