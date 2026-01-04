export default class Appointment {
    constructor(AppointmentCard, api) {
        this.card = AppointmentCard;
        this.values = [];
        this.api = api;

    }

    getSelectValues() {
        this.card.querySelectorAll("select").forEach(elem => {
            this.values.push(elem.value);
        });
    }
}