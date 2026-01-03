export default class AppointmentMaker {
    constructor(template, parent, defaultNames) {
        this.template = template;
        this.parent = parent;
        this.names = defaultNames;

        this.gap = getComputedStyle(this.parent).gap;

        if(this.parent.children.length > 2)
            this.counter = this.recoverCounter();
        else
            this.counter = 0;
    }

    createAppointment(isContainerScroll) {
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

        this.parent.prepend(newAppointment);

        if(isContainerScroll) {
            this.parent.scrollRight += newAppointment.clientWidth + this.gap;

        }

        this.counter++;
    }

    recoverCounter() {
        const firstAppointment = this.parent.children[0];
        
        const id = firstAppointment.querySelector("select").id;
        const oldCounter = +id[id.length - 1] + 1;

        console.log(oldCounter);
        return oldCounter;
    }
}