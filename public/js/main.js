import Carousel from "./components/carousel.js"
import Menu from "./components/mobileMenu.js";
import mouseDragger from "./components/calendarDragPC.js";

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("[data-carousel-container]").forEach(container => {
        const useGap = container.dataset.carouselContainer;
        const track = container.querySelector("[data-carousel-track]");
        const nextBtn = container.parentElement.querySelector("[data-carousel-btn-r]");
        const prevBtn = container.parentElement.querySelector("[data-carousel-btn-l]");
        
        new Carousel(container, track, nextBtn, prevBtn, useGap);
    });

    const menu = document.querySelector(".mobile-menu");
    const menuOpenBtn = document.querySelector("#burger-menu");
    const activeMenuClassName = "mobile-menu-active";

    new Menu(menu, menuOpenBtn, activeMenuClassName);

    const calendar = document.querySelector(".calendar-flex");
    new mouseDragger(calendar);
})