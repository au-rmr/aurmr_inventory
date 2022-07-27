import { useState } from 'react';

interface GeneratorProps {
    onChange: (objects: number, filtered: number[]) => void
    filterList: any[];
}

function Generator(props:GeneratorProps) {
    const [textArea, setTextArea] = useState<string>('');
    const [checkedState, setCheckedState] = useState(
        new Array(props.filterList.length).fill(false)
      );

    const parseNumBins = () => {
        let num = parseInt(textArea as string);
        if (isNaN(num) || num < 0 || num > 100) {
            alert("Invalid entry please enter numbers between 0-100.");
            return;
        }

        let checkedList: number[] = [];
        for (let i = 0; i < checkedState.length; i++) {
            if (checkedState[i]) {
                checkedList.push(props.filterList[i].id);
            }
        }
        props.onChange(num, checkedList);
    }

    const handleOnChange = (position: number) => {
        const updatedCheckedState = checkedState.map((item, index) => 
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }

    return (
        <>
            <div id = "num-bins">
                <div id="text">Number of objects:</div>
                <textarea
                    id="object-text-area"
                    rows={5}
                    cols={30}
                    onChange={(event) => setTextArea(event.target.value)}
                    value={textArea}
                /> <br/>
            </div>
            <button id="button" onClick={parseNumBins}>Submit</button>
            <div id="checkboxes">
                {props.filterList.map((att, index) => {
                    return (
                        <div id="filter" key={att.id}>
                            <input
                            type="checkbox"
                            id={`id-${index}`}
                            name={att.value}
                            value={att.value}
                            checked={checkedState[index]}
                            onChange={() => handleOnChange(index)}
                            /> {att.value}
                        </div>
                    )
                })}
            </div>
        </>
    );

}

export default Generator;