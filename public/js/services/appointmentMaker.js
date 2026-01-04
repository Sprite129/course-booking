export default class AppointmentMaker {
    constructor(template, parent, defaultNames, addButton) {
        this.template = template;
        this.parent = parent;
        this.names = defaultNames;
        this.btn = addButton;

        this.gap = getComputedStyle(this.parent).gap;

        if (this.parent.children.length > 2)
            this.counter = this.recoverCounter();
        else
            this.counter = 0;
    }

    createAppointment() {
        const newAppointment = this.template.content.cloneNode(true);

        newAppointment.querySelectorAll("select").forEach((elem, i) => {
            const newName = this.names[i] + "-" + this.counter;
            const newID = this.names[i] + "-id-" + this.counter;

            elem.name = newName;
            elem.id = newID;
        });

        newAppointment.querySelectorAll("label").forEach((elem, i) => {
            const newID = this.names[i] + "-id-" + this.counter;

            elem.setAttribute("for", newID);
        });

        this.btn.before(newAppointment);

        this.counter++;
    }

    recoverCounter() {
        const lastAppointment = this.btn.previousElementSibling;
        const lastAppointmentID = lastAppointment.querySelector("select").id;

        const oldCounter = +lastAppointmentID.match(/\d+\.?\d*/g) + 1;
        return oldCounter;
    }
}