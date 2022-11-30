interface Mapper {
    map: any,
}

class Mapper implements Mapper {
    constructor(file: string) {
        console.log("Mapper being constructed")
        this.map = {};
        fetch('/data/external_id_to_asin.tsv')
            .then((r) => r.text())
            .then(text => {
                const lines = text.split('\n');
                for (let i = 1; i < lines.length - 1; i++) {  // ignore first and last empty line
                    const cols = lines[i].split('\t');
                    const asin = cols[0];
                    const str = cols[1];
                    const ids: Array<string> = str.substring(1, str.length - 2).split(',');
                    for (const id of ids) {
                        this.map[id] = asin;
                    }
                }
            });

    }

    /*
    * input: an id on an object (shown like a barcode)
    * output: corresponding ASIN code
    */
    id2Asin(id: string) {
        return this.map[id]
    }
}

// Remove this when one testing
const mapper = new Mapper('6in.txt')
console.log(mapper.id2Asin('00038902103840'))

export default Mapper
