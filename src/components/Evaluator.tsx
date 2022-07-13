import './../styles/App.css';
import Generator from './Generator';
import { useState } from 'react';
import Table from "./Table";
import { graphql } from 'react-apollo'
import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/client';

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
    const [numObjects,setNumObjects] = useState<number>(0);
    
    const setObjects = (value: number) => {
        setNumObjects(value);
    }

    const {data, loading, error} = useQuery(ATT_QUERY);
    
    if (loading) return <p>Loading</p>;
    if (error) return <p>Error: {error.message}</p>

    let attributeList: string[] = [];
    for (let i = 0; i < Object.keys(data.getAllAttributes).length; i++) {
        attributeList.push(data.getAllAttributes[i].value);
    }
    console.log(data, Object.keys(data.getAllAttributes));
    return (
        <div id="main">
            <Generator onChange={(x:number) => {
                setObjects(x);
            }}
                    objectList={["A", "B", "C", "D"]}
                    filterList={attributeList}/>

            <Table numObjects={numObjects}
                    objectList={["A", "B", "C", "D"]}
            />
        </div>
    );
    
}

export default Evaluator;