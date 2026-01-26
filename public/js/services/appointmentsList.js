import CourseIdToString from "./courseIdToString.js";

export default class AppointmentsList {
    constructor(template, containerElement, insertTextElementClass, api) {
        this.template = template;
        this.parent = containerElement;
        this.insertClass = insertTextElementClass;

        this.idCounter = 0;

        this.api = api;

        this.ready = this.init(); 
    }

    async init() {
        const courses = await this.api.getCourses();
        this.courseIdToName = new CourseIdToString(courses);
    }

    createAndInsert(appointmentData, appointmentElementID) {
        if(!this.courseIdToName) {
            console.error("AppointmentsList service is not ready yet");
            return;
        }

        const elem = this.template.content.cloneNode(true);
        const textBox = elem.querySelector(`.${this.insertClass}`);
        const elemContainerElement = elem.querySelector("li");

        elemContainerElement.id = appointmentElementID;

        let message = "";
        appointmentData.forEach((val, index, array) => {
            if (!isNaN(+val)) {
                message += `${this.courseIdToName.translate(val)}, `;
                return
            }

            if (index < array.length - 1)
                message += `${val}, `;
            else
                message += val;
        });

        textBox.textContent = message;

        this.parent.append(elem);

        this.idCounter++;
    }
}