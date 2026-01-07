import Appointment from "../entities/appointmentEntity.js";
import AppointmentMaker from "../services/appointmentMaker.js";
import scheduleAPI from "../services/scheduleAPI.js";

export default class BookingController {
    constructor(bookingContainer, newAppointmentButton, appointmentTemplate, closeButtonClass) {
        this.container = bookingContainer;
        this.newBtn = newAppointmentButton;
        this.template = appointmentTemplate;
        this.closeBtnClass = closeButtonClass;
        this.appointmentsMap = new Map();

        this.selectNames = [];

        this.template.content.querySelectorAll("select").forEach(elem => {
            this.selectNames.push(elem.name);
        });

        this.api = new scheduleAPI("http://localhost:5000/schedule", "http://localhost:5000/courses");
        this.appointmentMaker = new AppointmentMaker(this.template, this.container, this.selectNames, this.newBtn);
    }

    init() {
        this.newBtn.addEventListener("click", (e) => {
            this.onNewAppointment(e);
        });

        this.container.addEventListener("change", (e) => {
            this.onAppointmentChange(e);
        });

        this.container.addEventListener("click", (e) => {
            this.onRemoveAppointment(e);
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

    onNewAppointment(event) {
        event.preventDefault();

        let newAppointment = this.appointmentMaker.createAppointment();
        let newAppointmentEntity = new Appointment(newAppointment, this.api, ["1", "Wednesday", ""]);

        this.appointmentsMap.set(newAppointment.id, newAppointmentEntity);
        this.updateScroll(true);
    }

    onAppointmentChange(event) {
        let appointmentCard = event.target.parentElement;
        let appointmentEntity = this.appointmentsMap.get(appointmentCard.id);

        appointmentEntity.updateSelect(event.target);
    }

    onRemoveAppointment(event) {
        const elem = event.target;

        if (elem.classList.contains(this.closeBtnClass)) {
            this.appointmentsMap.delete(elem.parentElement.id);

            elem.parentElement.remove();
            this.updateScroll();
        }
    }
}