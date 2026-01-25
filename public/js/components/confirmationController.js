import appointmentsCacher from "../services/appointmentsCache.js";
import AppointmentsList from "../services/appointmentsList.js";

export default class ConfirmAppointmentsController {
    constructor(appointmentTemplate, appointmentsContainer, appointmentIdName, paragraphClass, sessionStorageKey, saveTimer, confirmDeletionElement) {
        this.container = appointmentsContainer;
        this.key = sessionStorageKey;
        this.time = saveTimer;
        this.idName = appointmentIdName;
        this.confirmElement = confirmDeletionElement;

        this.elemToRemove;

        this.cacher = new appointmentsCacher(sessionStorageKey, saveTimer);
        this.appointmentsMaker = new AppointmentsList(appointmentTemplate, this.container, paragraphClass, this.idName);

        const data = this.cacher.load();
        this.appointmentsMaker.loadAndInsertAll(data);

        this.container.addEventListener("click", (e) => {
            this.onRemove(e);
        })

        this.confirmElement.addEventListener("click", (e) => {
            this.onPopUpClick(e);
        })
    }

    onRemove(event) {
        event.preventDefault();

        if (event.target.tagName == "BUTTON") {
            this.elemToRemove = event.target.closest("li");
            this.confirmElement.classList.add("message-visible");
        }
    }

    onPopUpClick(event) {
        event.preventDefault();

        if (event.target.id == "close-confirmation-btn") {
            this.confirmElement.classList.remove("message-visible");
            return;
        }

        if(event.target.id == "confirmation-btn") {
            this.confirmElement.classList.remove("message-visible");
            this.elemToRemove.remove();
        }
    }
}