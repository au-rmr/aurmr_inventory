import './../styles/App.css';
import { randomlyAssignObjects } from './AssignmentAlgorithm';

interface TableProps {
    contents: string[][];
    shelfDimensions: number[];
}

function Table(props:TableProps) {
    const makeTable = () => {
        let output = "<style> table, th, td { border:1px solid black; border-radius: 5px; padding: 5px;} .center {margin-left: auto; " +
            "margin-right: auto; font-family:sans-serif; }</style><table class='center'>";
        for (let i = 0 ; i < props.shelfDimensions[0] ; i++) {
            output += "<tr>";
            for (let j = 0 ; j < props.shelfDimensions[1] ; j++) {
                output += "<td>" + props.contents[(i*props.shelfDimensions[1])+(j)] + "</td>";
            }
            output += "</tr>";
        }
        output += "</table>";

        return output;
    }

    return (
        <div id="" dangerouslySetInnerHTML={{__html:  makeTable()}}/>
    );

}
export default Table;