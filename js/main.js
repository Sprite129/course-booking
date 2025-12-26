import Carousel from "./components/carousel.js"

document.addEventListener("DOMContentLoaded", () => {

    let isMobile = false;

    if('ontouchstart' in window || navigator.maxTouchPoints > 0)
        isMobile = true

    document.querySelectorAll("[data-carousel-container]").forEach(container => {
        let useGap = container.dataset.carouselContainer;
        let track = container.querySelector("[data-carousel-track]");
        if(!isMobile) {
            let nextBtn = container.parentElement.querySelector("[data-carousel-btn-r]");
            let prevBtn = container.parentElement.querySelector("[data-carousel-btn-l]");
            new Carousel(container, track, nextBtn, prevBtn, useGap);
        }
        
        new Carousel(container, track, null, null, useGap);
    });
})