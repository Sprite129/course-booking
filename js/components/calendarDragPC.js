export default class mouseDragger {
    constructor(elemToDrag) {
        this.elem = elemToDrag;
        this.isDragging = false;
        this.mouseInitialX = 0;
        this.initialScrollLeft = 0;
        
        this.elem.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onMouseUp);
    }

    onMouseDown = (e) => {
        const targetTag = e.target.tagName;

        if(targetTag != "DIV" && targetTag != "LABEL")
            return;

        if(targetTag == "LABEL")
            e.preventDefault();

        this.isDragging = true;

        this.mouseInitialX = e.clientX;
        this.initialScrollLeft = this.elem.scrollLeft;
    }

    onMouseMove = (e) => {
        if(!this.isDragging)
            return;

        const deltaX = this.mouseInitialX - e.clientX;
        this.elem.scrollLeft = this.initialScrollLeft + deltaX;
    }

    onMouseUp = () => {
        this.isDragging = false;
    }

}