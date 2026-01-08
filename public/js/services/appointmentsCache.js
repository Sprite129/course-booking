export default class appointmentsCacher {
    constructor(key, timeoutLength) {
        this.key = key;
        this.appointmentsArray;
        this.ms = timeoutLength;
        this.timeout;
    }

    debounceSave(data) {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.save(data);
        }, this.ms);
    }

    save(data) {
        sessionStorage.setItem(this.key, JSON.stringify(data));
    }

    load() {
        this.appointmentsArray = new Map(JSON.parse(sessionStorage.getItem(this.key)));

        return this.appointmentsArray;
    }
}