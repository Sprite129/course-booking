export default class Menu {
    constructor(menu, menuOpenButton, activeClassName) {
        this.menu = menu;
        this.buttonOpen = menuOpenButton;
        this.active = activeClassName;

        this.buttonOpen.addEventListener("click", () => {
            this.openMenu();
        });

        this.menu.addEventListener("click", (e) => {
            const tag = e.target.tagName;

            if(tag == "A" || tag == "BUTTON")
                this.closeMenu();
        });
    }

    openMenu() {
        this.menu.classList.add(this.active);
        document.body.classList.add("no-scroll");
    }

    closeMenu() {
        this.menu.classList.remove(this.active);
        document.body.classList.remove("no-scroll");
    }
}