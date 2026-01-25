import ConfirmAppointmentsController from "./components/confirmationController.js";

const template = document.querySelector("#booked-item");
const container = template.parentElement;
const confirmationPopUp = document.querySelector("#confirmation-pop-up")
const appointmentIdName = "appointment-card";
const paragraphClassName = "info";
const sessionStorageKey = "appointments";
const debounceTimer = 700;

const controller = new ConfirmAppointmentsController(template, container, appointmentIdName, paragraphClassName, sessionStorageKey, debounceTimer, confirmationPopUp);