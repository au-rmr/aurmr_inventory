import _ from 'lodash';

export const getRandomObjectsFromList = (n: any, objects: string[]) =>  {
    let output: any[] = [];
    for (let i = 0; i < n; i++) {
        output.push(_.sample(objects));
    }
    return output;
}

export const randomlyAssignObjects = (numOfBins: number, numObjects: number, objectList: string[]) => {
    let numBins = numOfBins;
    let numObjectsCopy = numObjects;
    let evenSplit: number[] = [];
    let contents: string[][] = [[]];
    if (numObjectsCopy > numBins) {
        while (numObjectsCopy > 0) {
            const truncatedDivision = Math.floor(numObjectsCopy/numBins);
            evenSplit.push(truncatedDivision);
            numObjectsCopy -= truncatedDivision;
            numBins--;
        }
    }
    else {
        while(numObjectsCopy > 0) {
            evenSplit.push(1);
            numObjectsCopy--;
        }
    }
    numObjectsCopy = numObjects;

    for (let i = 0; i < numObjectsCopy; i++) {
        let x = Math.floor(Math.random() * evenSplit.length);
        contents.push(getRandomObjectsFromList(evenSplit[x], objectList));
        evenSplit.splice(x, 1);
    }
    contents.splice(0,1);

    return contents;
}