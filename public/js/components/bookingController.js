import AppointmentMaker from "../services/appointmentMaker.js";
import scheduleAPI from "../services/scheduleAPI.js";

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

        this.appointmentMaker = new AppointmentMaker(this.template, this.container, this.selectNames, this.newBtn);
        this.api = new scheduleAPI("http://localhost:5000/schedule");
    }

    async init() {
        this.newBtn.addEventListener("click", (e) => {
            e.preventDefault();
            this.appointmentMaker.createAppointment();
            this.updateScroll(true);
        });

        this.container.addEventListener("change", (e) => {
            console.log("Change in " + e.target.id);
        });

        this.container.addEventListener("click", (e) => {
            const elem = e.target;

            if (elem.classList.contains(this.closeBtnClass)) {
                elem.parentElement.remove();
                this.updateScroll();
            }
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

}