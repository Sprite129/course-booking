export default class BookingValidator {
    constructor(api) {
        if (api)
            this.api = api;
    }

    removeDuplicates(data) {
        let newData = data.filter((value, index, self) =>
            index == self.findIndex((t) => (
                this.isEqualArrays(t[1], value[1])
            ))
        )
        
        return new Map(newData);
    }

    isEqualArrays(a, b) {
        return a.length == b.length && a.every((elem, i) => elem == b[i]);
    }
}