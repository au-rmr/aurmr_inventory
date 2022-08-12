import React, { Component, useEffect, useState } from 'react';

import { useLazyQuery, useQuery, useMutation } from '@apollo/client';

import Item from './Item';

import { GET_PROD_IN_BIN_FOR_EVAL } from '../GraphQLQueriesMuts/Query';

interface BinProps {
    binNameProp: string,
    podNameProp: string,
    evalNameProp: string,
    binTotalAvailableVolume: number,
    binDepth: number, 
    binWidth: number, 
    binHeight: number,
    binUnits: string
}

function Bin({ binNameProp, podNameProp, evalNameProp, binTotalAvailableVolume, binDepth, binHeight, binWidth, binUnits }: BinProps) {
    const [prods, setProds] = useState<string[]>([]);
    const [prodsJSX, setProdsJSX] = useState<JSX.Element>(<ul></ul>);

    const { data: prodFromBinEvalData, loading: prodFromBinEvalLoading, error: prodFromBinEvalError, refetch: prodFromBinEvalRefetch } = useQuery(GET_PROD_IN_BIN_FOR_EVAL);

    const gen = async () => {
        let listJSX: JSX.Element[] = [];
        let prodList = (await prodFromBinEvalRefetch({ evalName: evalNameProp, binName: binNameProp, tableName: "" + podNameProp + "" }));
        let prodsTemp: string[] = [];
        for (let i = 0; i < Object.keys(prodList.data.getAmazonProductFromBinEval).length; i++) {
            prodsTemp[i] = prodList.data.getAmazonProductFromBinEval[i].amazonProduct.name;
            console.log(prodsTemp[i])
            listJSX[i] = <li><Item amazonProductName={prodsTemp[i]}/></li>; 
        }
        setProds(prodsTemp);
        setProdsJSX(<ul>{listJSX}</ul>);
    }

    useEffect(() => {
        gen();
    }, []);

    return (
        <div>
            <> 
                <p>{binNameProp}</p>
                <p>{podNameProp}</p>
                <p>{evalNameProp}</p>
                <p>{binWidth} x {binHeight} x {binDepth} = {binTotalAvailableVolume} {binUnits}^3</p>
                {prodsJSX}
            </>

        </div>
    )
}

export default Bin;