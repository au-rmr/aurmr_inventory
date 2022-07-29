import _ from 'lodash';

export const getRandomObjectsFromList = (n: number, objects: string[]) =>  {
    let output: any[] = [];
    for (let i = 0; i < n; i++) {
        output.push(_.sample(objects));
    }
    return output;
}

export const randomlyAssignObjects = (numBins: number, numObjects: number, objectList: string[]) => {
    //empty case
    let contents: string[][] = [[]];
    if (numObjects == undefined) {
        while (numBins > 0) {
            let empty = [""];
            contents.push(empty);
            numBins--; 
        }
    }

    let fillWithEmpty = false;
    let numObjectsCopy = numObjects;
    let evenSplit: number[] = [];
    //case when number of objects exceeds number of bins
    if (numObjectsCopy > numBins) {
        while (numObjectsCopy > 0) {
            const truncatedDivision = Math.floor(numObjectsCopy/numBins);
            evenSplit.push(truncatedDivision);
            numObjectsCopy -= truncatedDivision;
            numBins--;
        }
    }
    //case when number of objects is less than number of bins
    else {
        fillWithEmpty = true;
        while(numObjectsCopy > 0) {
            evenSplit.push(1);
            numObjectsCopy--;
            numBins--;
        }
    }
    numObjectsCopy = numObjects;


    while(numObjectsCopy > 0) {
        let x = Math.floor(Math.random() * evenSplit.length);
        contents.push(getRandomObjectsFromList(evenSplit[x], objectList));
        numObjectsCopy -= evenSplit[x];
        evenSplit.splice(x, 1);
    }
    //filling with empty boxes for case when number of objects is less than number of bins
    if (fillWithEmpty) {
        while (numBins > 0) {
            let empty = [""];
            contents.push(empty);
            numBins--; 
        }
    }
    contents.splice(0,1);

    return shuffle(contents);
}

function shuffle(array: any[]) {
    return array
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
}