import './../styles/App.css';
import _ from 'lodash';

interface TableProps {
    numObjects: number;
    objectList: string[];
    checkedList: string[];
}

function Table(props:TableProps) {
    const binDimensions = [13, 4];

    const getRandomObjectsFromList = (n: any, objects: string[]) =>  {
        let output: any[] = [];
        for (let i = 0; i < n; i++) {
            output.push(_.sample(objects));
        }
        return output;
    }

    const randomlyAssignObjects = () => {
        let numBins = binDimensions[0] * binDimensions[1];
        let numObjectsCopy = props.numObjects;
        let evenSplit: number[] = [];
        let contents: string[][] = [[]];
        if (numObjectsCopy > numBins) {
            while (numObjectsCopy > 0) {
                const truncatedDivision = Math.floor(numObjectsCopy/numBins);
                evenSplit.push(truncatedDivision);
                numObjectsCopy -= truncatedDivision;
                numBins--;
            }
            console.log("entered");
        }
        else {
            while(numObjectsCopy > 0) {
                evenSplit.push(1);
                numObjectsCopy--;
            }
        }
        numObjectsCopy = props.numObjects;

        for (let i = 0; i < numObjectsCopy; i++) {
            let x = Math.floor(Math.random() * evenSplit.length);
            contents.push(getRandomObjectsFromList(evenSplit[x], props.objectList));
            evenSplit.splice(x, 1);
        }
        contents.splice(0,1);

        return contents;
    }

    const makeTable = () => {
        const contents: string[][] = randomlyAssignObjects();
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

    return (
        <div id="" dangerouslySetInnerHTML={{__html:  makeTable()}}/>
    );

}
export default Table;