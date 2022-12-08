interface Mapper {
    map: any,
}

/**
 * Parses a TSV file for ID to ASIN mapping and provides access
 * to said mappings.with amazon product links
 */
class Mapper implements Mapper {
    constructor(file: string) {
        console.log("Mapper being constructed")
        this.map = {};

        // TODO: Replace the TSV parsing in this file with some library
        // as this code is sus.
        fetch(file)
            .then((r) => r.text())
            .then(text => {
                const lines = text.split('\n');

                // Iterate over lines
                for (let i = 1; i < lines.length - 1; i++) {
                    const cols = lines[i].trim().split('\t');
                    const asin = cols[0];
                    const str = cols[1];

                    // Remove quotation marks surrounding the IDs.
                    // TODO: at some point we should probably switch this for logic
                    // which actually checks for the presence of the quotation marks.
                    const ids: Array<string> = str.substring(1, str.length - 1).split(',');
                    for (const id of ids) {
                        this.map[id] = asin;
                    }
                }
            });

    }

    /**
     * input: an id on an object (shown like a barcode)
     * output: corresponding ASIN code if found, `undefined` otherwise
     */
    id2Asin(id: string): string | undefined {
        return this.map[id]
    }
}

// Remove this when done testing
const mapper = new Mapper('/data/external_id_to_asin.tsv')
console.log(mapper.id2Asin('00038902103840'))

export default Mapper
