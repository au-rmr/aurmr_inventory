import './../styles/App.css';
import Generator from './Generator';
import { useEffect, useState } from 'react';
import Table from "./Table";
import { gql } from 'graphql-tag';
import { useQuery, useLazyQuery } from '@apollo/client';
import { randomlyAssignObjects } from './AssignmentAlgorithm';

const ATT_QUERY = gql`
  query {
    getAllAttributes{
        value
        id
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
    const [numberOfObjects, setNumberOfObjects] = useState<number>(0);
    const shelfDimensions: number[] = [13, 4];

    let attributeList: any[] = [];
    let filtList = new Set<string>();
    
    const {data: attData, loading: attLoading, error: attError} = useQuery(ATT_QUERY);
    const [getFiltProd, {data: filtData, loading: filtLoading, error: filtError}] = useLazyQuery(FILTER_BY_ATT_QUERY, {variables: {checkedBoxes}});
    
    useEffect(() => {
        getFiltProd({variables: {checkedBoxes}});
    }, [checkedBoxes]);
    
    useEffect(() => {
        fetchData();
        setContents(randomlyAssignObjects(shelfDimensions[0]*shelfDimensions[1], numberOfObjects, Array.from(filtList)));
    }, [filtData, numberOfObjects]);

    const callback = (numObjects: number, checked: number[]) => {
        setCheckedBoxes(checked);
        setNumberOfObjects(numObjects);
        fetchData();
        setContents(randomlyAssignObjects(shelfDimensions[0]*shelfDimensions[1], numberOfObjects, Array.from(filtList)));
    }
    
    if (attLoading) return <p>Loading</p>;
    if (attError) return <p>Error: {attError.message}</p>

    for (let i = 0; i < Object.keys(attData.getAllAttributes).length; i++) {
        attributeList.push(attData.getAllAttributes[i]);
    }

    function fetchData() {
        if (filtData !== undefined) {
            if (filtLoading) return <p>Loading</p>;
            if (filtError) return <p>Error: {filtError.message}</p>
            for (let i = 0; i < Object.keys(filtData.filterProdByAttr).length; i++) {
                for (let j = 0; j < Object.keys(filtData.filterProdByAttr[i].AmazonProducts).length; j++) {
                    filtList.add(filtData.filterProdByAttr[i].AmazonProducts[j].amazonProduct.name);
                }
            }
        }
    }
    
    

    return (
        <div id="main">
            <Generator onChange={callback} filterList={attributeList}/>
            <Table contents={contents} shelfDimensions={shelfDimensions}/>
        </div>
    );
    
}

export default Evaluator;