export default class Carousel {

    constructor(carouselContainer, carouselTrack, nextButton, prevButton, useGap = false) {
        this.container = carouselContainer;
        this.track = carouselTrack;
        this.nextBtn = nextButton;
        this.prevBtn = prevButton;

        if (useGap) {
            this.gap = parseFloat(getComputedStyle(this.track).gap);
            this.padding = parseFloat(getComputedStyle(this.container).padding);
        }
        else {
            this.gap = 0;
            this.padding = 0;
        }

        this.pageCounter = 0;
        this.maxPage = Math.floor(this.track.scrollWidth / this.container.clientWidth) - 1;

        this.nextBtn.addEventListener("click", () => this.next());
        this.prevBtn.addEventListener("click", () => this.prev());
    }

    next() {
        this.pageCounter++;
        if (this.pageCounter > this.maxPage)
            this.pageCounter = 0;

        this.updatePosition();
    }

    prev() {
        this.pageCounter--;
        if (this.pageCounter < 0)
            this.pageCounter = this.maxPage;

        this.updatePosition();
    }

    updatePosition() {
        this.track.style.transform = `translateX(${-this.pageCounter * (this.container.clientWidth + this.gap - (this.padding * 2))}px)`;
    }
}