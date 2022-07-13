import './../styles/App.css';
import Generator from './Generator';
import { useState } from 'react';
import Table from "./Table";
import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { randomlyAssignObjects } from './AssignmentAlgorithm';

const ATT_QUERY = gql`
  query {
    getAllAttributes{
        value
    }
  }
`;

const ALL_PROD_QUERY = gql`
    query {
        getAllProducts{
            name
        }
    }
`;

function Evaluator() {
    const [checkedBoxes, setCheckedBoxes] = useState<string[]>([]);
    const [contents, setContents] = useState<string[][]>([[]]);
    const shelfDimensions: number[] = [13, 4];

    const {data: attData, loading: attLoading, error: attError} = useQuery(ATT_QUERY);
    const {data: prodData, loading: prodLoading, error: prodError} = useQuery(ALL_PROD_QUERY);

    if (attLoading) return <p>Loading</p>;
    if (attError) return <p>Error: {attError.message}</p>

    let attributeList: string[] = [];
    for (let i = 0; i < Object.keys(attData.getAllAttributes).length; i++) {
        attributeList.push(attData.getAllAttributes[i].value);
    }
    
    if (prodLoading) return <p>Loading</p>;
    if (prodError) return <p>Error: {prodError.message}</p>

    let prodList: string[] = [];
    for (let i = 0; i < Object.keys(prodData.getAllProducts).length; i++) {
        prodList.push(prodData.getAllProducts[i].name);
    }
    
    return (
        <div id="main">
            <Generator onChange={(x:number, y: string[]) => {
                setContents(randomlyAssignObjects(shelfDimensions[0]*shelfDimensions[1], x, prodList));
                setCheckedBoxes(y);
            }}
                    objectList={prodList}
                    filterList={attributeList}/>

            <Table contents={contents}
                   shelfDimensions={shelfDimensions}
            />
        </div>
    );
    
}

export default Evaluator;