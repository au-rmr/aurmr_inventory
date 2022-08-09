import './../styles/App.css';
import { useEffect, useState } from 'react';
import { gql } from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/client';
import { Button, FormControl, FormLabel, Input, InputLabel } from '@mui/material';
import { GET_PROD_BIN_IDS } from '../GraphQLQueriesMuts/Query';
import { ADD_PICK_FOR_AN_EVAL } from '../GraphQLQueriesMuts/Mutation';
import { useCSVReader } from 'react-papaparse';

interface PickHandlerProps {
}

function PickHandler(props: PickHandlerProps) {
    const [evalTextArea, setEvalTextArea] = useState<string>("");
    const [uploadedData, setUploadedData] = useState<string[]>();
    const { CSVReader } = useCSVReader();
    
    const {refetch: prodBinRefetch} = useQuery(GET_PROD_BIN_IDS);
    const [add_pick, { data: addPickData, loading: addPickLoading, error: addPickError }] = useMutation(ADD_PICK_FOR_AN_EVAL);

    if (addPickLoading) return <p>Submitting...</p>
    if (addPickError) return <p>Error: {addPickError.message}</p>
    function addPickToSequence(productBinIds: number[]) {
        productBinIds.forEach((id: number) => {
            console.log(typeof(id));
            add_pick({variables: {ProductBinId: id}});
        });
    }

    async function onSubmit() {
        if (uploadedData && evalTextArea) {
            let productBinIds: number[] = [];
            console.log(uploadedData, evalTextArea);
            for (let i = 0; i < uploadedData.length; i++) {
                const asinValue = uploadedData[i];
                console.log(asinValue);
                let value = await prodBinRefetch({asin: asinValue[1], binId: "P-5-M285U772", evalName: evalTextArea});
                productBinIds.push(parseInt(value.data.getProductBinFromAmazonProductBinEval[0].id));
            }
            addPickToSequence(productBinIds);
        }
    }

    return (
        <>

            <div id = "left-content">
                <div id="heading-text">Upload File</div>
                <CSVReader
                    onUploadAccepted={(results: any) => {
                        setUploadedData(results.data)
                    }}
                >
                    {({
                        getRootProps,
                        acceptedFile,
                        ProgressBar,
                        getRemoveFileProps
                    }: any) => (
                        <>
                            <div>
                                <Button variant="outlined" onClick={onSubmit} {...getRootProps()}>
                                    Browse
                                </Button>
                                <div>
                                    {acceptedFile && acceptedFile.name}
                                </div>
                                <Button variant="outlined" color="error" {...getRemoveFileProps()}>
                                    Remove
                                </Button>
                            </div>
                            <ProgressBar/>
                        </>
                    )}
                </CSVReader>
                <br/>
                <div id="heading-text">Evalution Name</div>
                <textarea
                    id="pick-text-area"
                    onChange={(event) => setEvalTextArea(event.target.value)}
                    value={evalTextArea}
                /> <br/>

                <Button variant="contained" color="success" onClick={onSubmit}>Submit</Button>

            </div>
        </>
    );
    
}

export default PickHandler;