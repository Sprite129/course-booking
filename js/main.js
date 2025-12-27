import Carousel from "./components/carousel.js"

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("[data-carousel-container]").forEach(container => {
        let useGap = container.dataset.carouselContainer;
        let track = container.querySelector("[data-carousel-track]");
        let nextBtn = container.parentElement.querySelector("[data-carousel-btn-r]");
        let prevBtn = container.parentElement.querySelector("[data-carousel-btn-l]");
        
        new Carousel(container, track, nextBtn, prevBtn, useGap);
    });
})