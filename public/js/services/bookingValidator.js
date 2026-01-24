export default class BookingValidator {
    constructor(api, dataChangeFlag) {
        if (api)
            this.api = api;
    }

    removeDuplicatesAndEmpty(data, clearUncomplete) {
        let newData = data.filter((value, index, self) => {
            const current = value[1];
            if (this.isEmptyArray(current))
                return false;

            if (!this.isFullArray(current) && clearUncomplete)
                return false;
            else if(!this.isFullArray(current) && !clearUncomplete)
                return true;

            return index === self.findIndex(t =>
                this.isEqualArrays(t[1], current)
            );
        });

        return newData;
    }

    isEqualArrays(arrayA, arrayB) {
        return arrayA.length == arrayB.length && arrayA.every((elem, i) => elem == arrayB[i]);
    }

    isEmptyArray(array) {
        return this.emptyLinesCount(array) == array.length;
    }

    isFullArray(array) {
        return this.emptyLinesCount(array) == 0;
    }

    emptyLinesCount(array) {
        let emptyColumns = 0;
        array.forEach(elem => {
            if (elem == "")
                emptyColumns++;
        });

        return emptyColumns;
    }
}