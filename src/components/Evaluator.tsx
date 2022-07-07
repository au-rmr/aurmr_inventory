import './../styles/App.css';
import Generator from './Generator';
import React, {Component} from 'react';
import Table from "./Table";

interface AppState {
    numObjects: number;
}

class Evaluator extends Component<{}, AppState>{
    constructor(props: any) {
        super(props);
        this.state = {
            numObjects: 0
        };
    }
    setObjects(value: number) {
        this.setState({
            numObjects: value
        })
    }

    render() {
        return (
            <div id="main">
                <Generator onChange={(x) => {
                    this.setObjects(x);
                }}
                           objectList={["A", "B", "C", "D"]}
                           filterList={["Deformable", "Small", "Large"]}/>

                <Table numObjects={this.state.numObjects}
                       objectList={["A", "B", "C", "D"]}
                />
            </div>
        );
    }
    
}
export default Evaluator;