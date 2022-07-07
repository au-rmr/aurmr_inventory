import React, { Component } from 'react';

interface GeneratorProps {
    onChange(objects: number): void;
    objectList: string[];
    filterList: string[];
}

interface GeneratorState {
    textArea: string;
    checkedList: string[]
}

class Generator extends Component<GeneratorProps,GeneratorState> {

    constructor(props: GeneratorProps) {
        super(props);
        this.state = {
            textArea: "80",
            checkedList: []
        };
    }

    textAreaOnChange(event: any) {
        this.setState({
            textArea: event.target.value
        })
    }

    parseNumBins(str: string) {
        let num = parseInt(str as string);
        if (isNaN(num) || num < 0 || num > 100) {
            alert("Invalid entry please enter numbers between 0-100.");
            return;
        }
        this.props.onChange(num);
    }

    handleCheckboxChange = (attribute: string) => {
        let sel = this.state.checkedList;
        const find = sel.indexOf(attribute);
        if (find > -1) {
            sel.splice(find, 1);
        }
        else {
            sel.push(attribute);
        }

        this.setState({
            checkedList: sel
        })
    }

    
    render() {
        return (
            <>
                <div id = "num-bins">
                    <div id="text">Number of objects:</div>
                    <textarea
                        id="text-area"
                        rows={5}
                        cols={30}
                        onChange={(event) => this.textAreaOnChange(event)}
                        value={this.state.textArea}
                    /> <br/>
                    <button id="submit-button" onClick={() => {this.parseNumBins(this.state.textArea)}}>Submit</button>

                    
                </div>
                {
                    this.props.filterList &&
                    this.props.filterList.map((name) => <div id="filter"><input
                        type="checkbox"
                        value={name}
                        checked={this.state.checkedList.includes(name)}
                        onChange={() => this.handleCheckboxChange(name)}
                    /> {name} <br/></div>)
                }
            </>
        );
    }
    
}

export default Generator;