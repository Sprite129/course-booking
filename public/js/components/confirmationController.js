import appointmentsCacher from "../services/appointmentsCache.js";
import AppointmentsList from "../services/appointmentsList.js";
import scheduleAPI from "../services/scheduleAPI.js";

export default class ConfirmAppointmentsController {
    constructor(appointmentTemplate, appointmentsContainer, paragraphClass, sessionStorageKey, saveTimer, confirmDeletionElement) {
        this.container = appointmentsContainer;
        this.key = sessionStorageKey;
        this.time = saveTimer;
        this.confirmElement = confirmDeletionElement;

        this.elemToRemove;

        this.api = new scheduleAPI("http://localhost:5000/schedule", "http://localhost:5000/courses");
        this.appointmentsMaker = new AppointmentsList(appointmentTemplate, this.container, paragraphClass, this.api);
        this.cacher = new appointmentsCacher(sessionStorageKey, saveTimer);

        this.ready = this.init();

        this.container.addEventListener("click", (e) => {
            this.onContainerClick(e);
        })

        this.confirmElement.addEventListener("click", (e) => {
            this.onPopUpClick(e);
        })
    }

    async init() {
        await this.appointmentsMaker.ready;

        this.appointmentsMap = this.cacher.load();

        this.appointmentsMap.forEach((elem, key) => {
            this.appointmentsMaker.createAndInsert(elem, key);
        })
    }

    onContainerClick(event) {
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

        if (event.target.id == "confirmation-btn") {
            this.confirmElement.classList.remove("message-visible");
            this.removeAppointment();
        }
    }

    removeAppointment() {
        this.appointmentsMap.delete(this.elemToRemove.id);
        this.elemToRemove.remove();

        this.cacher.debounceSave([...this.appointmentsMap]);
    }
}