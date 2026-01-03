import AppointmentMaker from "../services/appointmentMaker.js";

export default class BookingController {
    constructor(bookingContainer, newAppointmentButton, appointmentTemplate, closeButtonClass) {
        this.container = bookingContainer;
        this.newBtn = newAppointmentButton;
        this.template = appointmentTemplate;
        this.closeBtnClass = closeButtonClass;

        this.selectNames = [];

        this.template.content.querySelectorAll("select").forEach(elem => {
            this.selectNames.push(elem.name);
        });

        this.appointmentMaker = new AppointmentMaker(this.template, this.container, this.selectNames);

    }

    init() {
        this.newBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.appointmentMaker.createAppointment(this.checkForScroll());
        });

        this.container.addEventListener("change", (e) => {
            console.log("Change in " + e.target.id);
        });

        this.container.addEventListener("click", (e) => {
            const elem = e.target;

            if(elem.classList.contains(this.closeBtnClass))
                elem.parentElement.remove();
        })
    }

    checkForScroll() {
        if(this.container.scrollWidth <= this.container.clientWidth)
            return false;

        return true;
    }
}