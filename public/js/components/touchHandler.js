export default function touchHandler(surface, onSwipe) {
    let startCoords;
    let endCoords;
    let difference;

    surface.addEventListener("touchstart", (e) => {
        startCoords = e.touches[0].clientX;
    });
    surface.addEventListener("touchend", (e) => {
        endCoords = e.changedTouches[0].clientX;
        difference = endCoords - startCoords;

        if (difference > 50) {
            onSwipe(1);
        }
        else if (difference < -50) {
            onSwipe(-1);
        }
    });
}