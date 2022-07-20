import './../styles/App.css';
import Generator from './Generator';
import { useEffect, useState } from 'react';
import Table from "./Table";
import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { randomlyAssignObjects } from './AssignmentAlgorithm';

const ATT_QUERY = gql`
  query {
    getAllAttributes{
        value
        id
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

const FILTER_BY_ATT_QUERY = gql`
    query filterByAttr($checkedBoxes:[ID!]) {
        filterProdByAttr(attributes:$checkedBoxes) {
            AmazonProducts {
                amazonProduct {
                    name
                }
            }
            value
        }
    }
`;

function Evaluator() {
    const [checkedBoxes, setCheckedBoxes] = useState<number[]>([]);
    const [contents, setContents] = useState<string[][]>([[]]);
    const shelfDimensions: number[] = [13, 4];

    
    const {data: attData, loading: attLoading, error: attError} = useQuery(ATT_QUERY);
    const {data: prodData, loading: prodLoading, error: prodError} = useQuery(ALL_PROD_QUERY);
    const {data: filtData, loading: filtLoading, error: filtError} = useQuery(FILTER_BY_ATT_QUERY, {variables: {checkedBoxes}});

    if (attLoading) return <p>Loading</p>;
    if (attError) return <p>Error: {attError.message}</p>

    let attributeList: any[] = [];
    for (let i = 0; i < Object.keys(attData.getAllAttributes).length; i++) {
        attributeList.push(attData.getAllAttributes[i]);
    }
    
    if (prodLoading) return <p>Loading</p>;
    if (prodError) return <p>Error: {prodError.message}</p>

    let prodList: string[] = [];
    for (let i = 0; i < Object.keys(prodData.getAllProducts).length; i++) {
        prodList.push(prodData.getAllProducts[i].name);
    }

    if (filtLoading) return <p>Loading</p>;
    if (filtError) return <p>Error: {filtError.message}</p>

    let filtList = new Set<string>();
    for (let i = 0; i < Object.keys(filtData.filterProdByAttr).length; i++) {
        for (let j = 0; j < Object.keys(filtData.filterProdByAttr[i].AmazonProducts).length; j++) {
            filtList.add(filtData.filterProdByAttr[i].AmazonProducts[j].amazonProduct.name);
        }
    }
    console.log(filtList);
    console.log(checkedBoxes);

    return (
        <div id="main">
            <Generator onChange={(numObjects:number, checked: number[]) => {
                setContents(randomlyAssignObjects(shelfDimensions[0]*shelfDimensions[1], numObjects, Array.from(filtList)));
                setCheckedBoxes(checked);
            }}
                    filterList={attributeList}/>

            <Table contents={contents}
                   shelfDimensions={shelfDimensions}
            />
        </div>
    );
    
}

export default Evaluator;