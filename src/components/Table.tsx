import { useState } from 'react';
import './../styles/App.css';

interface TableProps {
    onChange: (evalName: string) => void
    contents: string[][];
    shelfDimensions: number[];
}

function Table(props:TableProps) {
    const [textArea, setTextArea] = useState<string>('');
    
    const makeTable = () => {
        let output = "<style> table, th, td { border:1px solid black; border-radius: 5px; padding: 5px;} .center {margin-left: auto; " +
            "margin-right: auto; font-family:sans-serif; }</style><table class='center'>";
        for (let i = 0; i < props.shelfDimensions[0]; i++) {
            output += "<tr>";
            for (let j = 0; j < props.shelfDimensions[1]; j++) {
                output += "<td>" + props.contents[(i*props.shelfDimensions[1])+(j)] + "</td>";
            }
            output += "</tr>";
        }
        output += "</table>";

        return output;
    }

    // const handleSave = () => {
    //     // TODO: add implementation
    // }

    return (
        <>
            <div id="text">Unique Evaluation Name:</div>
            <textarea
                id="evaluation-text-area"
                onChange={(event) => setTextArea(event.target.value)}
                value={textArea}
            />
            <br/>

            {/* <button id="button" onClick={handleSave}>Save</button> */}
            <div id="" dangerouslySetInnerHTML={{__html:  makeTable()}}/>
        </>
    );

}
export default Table;