import { useState } from 'react';

interface GeneratorProps {
    onChange(objects: number, filtered: string[]): any;
    objectList: string[];
    filterList: string[];
}

function Generator(props:GeneratorProps) {
    const [textArea, setTextArea] = useState<string>('80');
    const [checkedList, setCheckedList] = useState<string[]>([]);

    const parseNumBins = () => {
        console.log(textArea);
        let num = parseInt(textArea as string);
        console.log(num);
        if (isNaN(num) || num < 0 || num > 100) {
            alert("Invalid entry please enter numbers between 0-100.");
            return;
        }
        props.onChange(num, checkedList);
    }

    const handleCheckboxChange = (attribute: string) => {
        let sel : string[] = checkedList;
        const find = sel.indexOf(attribute);
        if (find > -1) {
            sel.splice(find, 1);
        }
        else {
            sel.push(attribute);
        }

        setCheckedList(sel);
        console.log(checkedList);
    }

    return (
        <>
            <div id = "num-bins">
                <div id="text">Number of objects:</div>
                <textarea
                    id="text-area"
                    rows={5}
                    cols={30}
                    onChange={(event) => setTextArea(event.target.value)}
                    value={textArea}
                /> <br/>
            </div>
            <button id="submit-button" onClick={parseNumBins}>Submit</button>

            {
                props.filterList &&
                props.filterList.map((name:string) => <div id="filter" key={Math.random()}><input
                    type="checkbox"
                    value={name}
                    checked={checkedList.includes(name)}
                    onChange={() => handleCheckboxChange(name)}
                /> {name} <br/></div>)
            }
        </>
    );

}

export default Generator;