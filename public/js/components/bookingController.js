import Appointment from "../entities/appointmentEntity.js";
import AppointmentMaker from "../services/appointmentMaker.js";
import appointmentsCacher from "../services/appointmentsCache.js";
import BookingValidator from "../services/bookingValidator.js";
import scheduleAPI from "../services/scheduleAPI.js";

export default class BookingController {
    constructor(bookingContainer, newAppointmentButton, appointmentTemplate, closeButtonClass, warningMessageElement, confirmMessageElement, warningDisplayTime) {
        this.container = bookingContainer;
        this.formElement = bookingContainer.parentElement;
        this.newBtn = newAppointmentButton;
        this.template = appointmentTemplate;
        this.closeBtnClass = closeButtonClass;

        this.warningElement = warningMessageElement;
        this.confirmElement = confirmMessageElement;

        this.warningMessageDuration = warningDisplayTime;

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
        });

        this.container.addEventListener("click", (e) => {
            this.onContainerClick(e);
        })

        this.confirmElement.addEventListener("click", (e) => {
            this.onConfirmElemClick(e);
        })

        this.formElement.addEventListener("submit", (e) => {
            this.onSubmit(e);
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

        const appointmentsData = this.collectAppointmentsData();
        this.saveAppointments([...appointmentsData]);
    }

    onAppointmentChange(event) {
        let appointmentCard = event.target.parentElement;
        let appointmentEntity = this.appointmentsMap.get(appointmentCard.id);

        appointmentEntity.updateSelect(event.target);

        const appointmentsData = this.collectAppointmentsData();
        this.saveAppointments([...appointmentsData]);
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

        if (elem.id == "close-confirmation-btn") {
            this.confirmElement.classList.remove("message-visible");
        }

        if (elem.id == "confirmation-btn") {
            this.appointmentsMap.delete(this.appointmentToDelete.id);
            this.appointmentToDelete.remove();

            const appointmentsData = this.collectAppointmentsData();
            this.saveAppointments([...appointmentsData]);

            this.confirmElement.classList.remove("message-visible");

            this.updateScroll();
        }
    }

    collectAppointmentsData() {
        let data = new Map();

        this.appointmentsMap.forEach((appointment, key) => {
            data.set(key, appointment.actualVals);
        })

        return data;
    }

    saveAppointments(data, immediateSave) {
        if (immediateSave) {
            this.cacheMangaer.save(data);
            return;
        }

        this.cacheMangaer.debounceSave(data);
    }

    recoverAppointments() {
        const restoredAppointmentsMap = this.cacheMangaer.load();

        if (!restoredAppointmentsMap.size)
            return;

        const noDuplicates = this.validator.removeDuplicatesAndEmpty([...restoredAppointmentsMap]);
        const noDuplicatesMap = new Map(noDuplicates);

        if (restoredAppointmentsMap.size != noDuplicatesMap.size)
            this.showWarning();

        noDuplicatesMap.forEach(appointment => {
            this.onNewAppointment(null, appointment);
        });
    }

    showWarning() {
        this.warningElement.classList.add("message-visible");

        setInterval(() => {
            this.warningElement.classList.remove("message-visible");
        }, this.warningMessageDuration);
    }

    onSubmit(event) {
        event.preventDefault();

        const appointmentsData = this.collectAppointmentsData();
        const cleanData = this.validator.removeDuplicatesAndEmpty([...appointmentsData], true);
        
        if(!cleanData.length) {
            return;
        }

        this.saveAppointments(cleanData, true);

        window.location.assign("../../pages/confirmation-page.html");
    }
}