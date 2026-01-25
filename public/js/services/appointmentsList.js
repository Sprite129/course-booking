export default class AppointmentsList {
    constructor(template, containerElement, insertTextElementClass, idName) {
        this.template = template;
        this.parent = containerElement;
        this.insertClass = insertTextElementClass;
        this.idName = idName;

        this.idCounter = 0;
    }

    loadAndInsertAll(appointmentsData) {
        appointmentsData.forEach(entry => {
            const elem = this.template.content.cloneNode(true);
            const textBox = elem.querySelector(`.${this.insertClass}`);
            const elemContainerElement = elem.querySelector(`#${this.idName}`);

            elemContainerElement.id = this.idName + "-" + this.idCounter;
            
            let message = "";
            entry.forEach((val, index, array) => {
                if(index < array.length - 1)
                    message += `${val}, `;
                else
                    message += val;
            });

            textBox.textContent = message;

            this.parent.append(elem);

            this.idCounter++;
        });
    }
}