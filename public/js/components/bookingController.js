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

        this.api = new scheduleAPI("http://localhost:5000/schedule", "http://localhost:5000/courses");
        this.appointmentMaker = new AppointmentMaker(this.template, this.container, this.selectNames, this.newBtn);
    }

    init() {
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

        this.loadData();
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

    async loadData() {
        // try {
        //     let courses = await this.api.getCourses();
        //     console.log(courses);
        // }
        // catch(err) {
        //     console.error(err.message);
        // }

        // try {
        //     let days = await this.api.getSchedule("1");
        //     console.log(days);
        // }
        // catch (err) {
        //     console.log(err.message);
        // }

        // try {
        //     let hours = await this.api.getSchedule("1", "Wednesday");
        //     console.log(hours);
        // }
        // catch (err) {
        //     console.log(err.message);
        // }

    }

}