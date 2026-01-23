import Appointment from "../entities/appointmentEntity.js";
import AppointmentMaker from "../services/appointmentMaker.js";
import appointmentsCacher from "../services/appointmentsCache.js";
import BookingValidator from "../services/bookingValidator.js";
import scheduleAPI from "../services/scheduleAPI.js";

export default class BookingController {
    constructor(bookingContainer, newAppointmentButton, appointmentTemplate, closeButtonClass, warningMessageElement, confirmMessageElement) {
        this.container = bookingContainer;
        this.newBtn = newAppointmentButton;
        this.template = appointmentTemplate;
        this.closeBtnClass = closeButtonClass;

        this.warningElement = warningMessageElement;
        this.confirmElement = confirmMessageElement;

        this.appointmentsMap = new Map();
        this.appointmentToDelete;

        this.selectNames = [];

        this.template.content.querySelectorAll("select").forEach(elem => {
            this.selectNames.push(elem.name);
        });

        this.api = new scheduleAPI("http://localhost:5000/schedule", "http://localhost:5000/courses");
        this.appointmentMaker = new AppointmentMaker(this.template, this.container, this.selectNames, this.newBtn, 2);
        this.cacheMangaer = new appointmentsCacher("appointments", 700);
        this.validator = new BookingValidator();
    }

    init() {
        this.recoverAppointments();

        this.newBtn.addEventListener("click", (e) => {
            this.onNewAppointment(e);
        });

        this.container.addEventListener("change", (e) => {
            this.onAppointmentChange(e);
            this.saveAppointments();
        });

        this.container.addEventListener("click", (e) => {
            this.onContainerClick(e);
        })

        this.confirmElement.addEventListener("click", (e) => {
            this.onConfirmElemClick(e);
        })
    }

    checkForScroll() {
        if (this.container.scrollWidth <= this.container.clientWidth)
            return false;
        return true;
    }

    updateScroll(isScrollUp) {
        if (this.checkForScroll() && this.container.style.justifyContent == "") {
            this.container.style.justifyContent = "flex-start";
        }
        else if (!this.checkForScroll() && this.container.style.justifyContent == "flex-start") {
            this.container.style.justifyContent = "";
        }

        if (this.checkForScroll() && isScrollUp) {
            this.container.scrollLeft += this.newBtn.clientWidth;
        }
    }

    onNewAppointment(event, restoredAppointment) {
        if (event)
            event.preventDefault();

        let newAppointment = this.appointmentMaker.createAppointment();
        let newAppointmentEntity = restoredAppointment ? new Appointment(newAppointment, this.api, restoredAppointment) : new Appointment(newAppointment, this.api);

        this.appointmentsMap.set(newAppointment.id, newAppointmentEntity);
        this.updateScroll(true);
    }

    onAppointmentChange(event) {
        let appointmentCard = event.target.parentElement;
        let appointmentEntity = this.appointmentsMap.get(appointmentCard.id);

        appointmentEntity.updateSelect(event.target);
    }

    onContainerClick(event) {
        event.preventDefault();
        const elem = event.target;

        if (elem.classList.contains(this.closeBtnClass)) {
            this.confirmElement.classList.add("message-visible");
            this.appointmentToDelete = elem.parentElement;
        }
    }

    onConfirmElemClick(event) {
        event.preventDefault();

        const elem = event.target;

        if(elem.id == "close-confirmation-btn"){
            this.confirmElement.classList.remove("message-visible");
        }
        
        if(elem.id == "confirmation-btn") {
            this.appointmentsMap.delete(this.appointmentToDelete.id);
            this.appointmentToDelete.remove();

            this.saveAppointments();

            this.confirmElement.classList.remove("message-visible");

            this.updateScroll();
        }
    }

    saveAppointments() {
        let data = new Map();

        this.appointmentsMap.forEach((appointment, key) => {
            data.set(key, appointment.actualVals);
        })

        this.cacheMangaer.debounceSave([...data]);
    }

    recoverAppointments() {
        const restoredAppointmentsMap = this.cacheMangaer.load();

        if (!restoredAppointmentsMap.size)
            return;

        const noDuplicates = this.validator.removeDuplicatesAndEmpty([...restoredAppointmentsMap]);
        const noDuplicatesMap = new Map(noDuplicates);

        noDuplicatesMap.forEach(appointment => {
            this.onNewAppointment(null, appointment);
        });
    }
}