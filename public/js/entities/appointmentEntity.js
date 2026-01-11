export default class Appointment {
    constructor(AppointmentCard, api, previousSelectedValues) {
        this.card = AppointmentCard;
        this.api = api;
        this.actualVals = [];
        this.selectElements = Array.from(this.card.querySelectorAll("select"));
        this.recoveredVals = previousSelectedValues || [];

        this.init();
    }

    async init() {
        await this.updateSelect();
        if(this.recoveredVals.length) {
            await this.recoverSelected();
        }
    }

    async updateSelect(target) {
        let updateIndex = -1;
        if (target)
            updateIndex = this.selectElements.indexOf(target);

        switch (updateIndex) {
            case -1:
                let courses;
                updateIndex++;

                this.addLoadingIndicator(this.selectElements[updateIndex]);
                try {
                    courses = await this.api.getCourses();
                }
                catch (err) {
                    console.error(err.message);
                }
                finally {
                    this.fillWithOptions(this.selectElements[updateIndex], courses);
                }

                break;

            case 0:
                let days;
                updateIndex++;

                const lastSelect = this.selectElements[this.selectElements.length - 1];
                this.clearOptions(lastSelect);
                this.addPlaceholder(lastSelect, this.getSelectType(lastSelect));

                this.addLoadingIndicator(this.selectElements[updateIndex]);
                try {
                    days = await this.api.getSchedule(this.getCourseValue());
                }
                catch (err) {
                    console.error(err.message);
                }
                finally {
                    this.fillWithOptions(this.selectElements[updateIndex], days);
                }
                break;

            case 1:
                let hours;
                updateIndex++;

                this.addLoadingIndicator(this.selectElements[updateIndex]);
                try {
                    hours = await this.api.getSchedule(this.getCourseValue(), this.getDayValue());
                }
                catch (err) {
                    console.error(err.message);
                }
                finally {
                    this.fillWithOptions(this.selectElements[updateIndex], hours);
                }
                break;

            default:
                break;

        }

        this.saveVals();
    }

    fillWithOptions(select, data) {
        if (!data || !select) {
            return;
        }

        this.clearOptions(select);

        const type = this.getSelectType(select);

        if (type == "course")
            data.forEach(entry => {
                let option = document.createElement("option");
                option.textContent = entry.name;
                option.value = entry.id;

                select.append(option);
            });
        else if (type == "day")
            data.forEach(entry => {
                let option = document.createElement("option");
                option.textContent = entry;
                option.value = entry;

                select.append(option);
            });
        else
            data.forEach(entry => {
                let option = document.createElement("option");
                option.textContent = entry.hour;
                option.value = entry.hour;

                if (!entry.isAvailable) {
                    option.disabled = "true";
                    option.classList.add("calendar-option-unavailable");
                }

                select.append(option);
            });

        this.addPlaceholder(select, type);
    }

    getSelectType(select) {
        return select.name.split("-")[0];
    }

    getCourseValue() {
        return this.selectElements[0].value;
    }

    getDayValue() {
        return this.selectElements[1].value;
    }

    getHourValue() {
        return this.selectElements[2].value;
    }

    clearOptions(select) {
        select.innerHTML = "";
    }

    addLoadingIndicator(select) {
        let newOption = document.createElement("option");
        newOption.value = "";
        newOption.textContent = "Loading...";
        newOption.selected = true;

        this.clearOptions(select);
        select.append(newOption);
    }

    addPlaceholder(select, type) {
        let placeholder = document.createElement("option");
        placeholder.textContent = "Select " + type;
        placeholder.disabled = "true";
        placeholder.selected = "true";

        select.prepend(placeholder);
    }

    saveVals() {
        this.selectElements.forEach((elem, i) => {
            if (elem.value.includes("Select"))
                this.actualVals[i] = '';
            else
                this.actualVals[i] = elem.value;
        })
    }

    async recoverSelected() {
        for (let i = 0; i < this.selectElements.length; i++) {
            if (this.existsInOptions(this.selectElements[i], this.recoveredVals[i])) {
                this.selectElements[i].value = this.recoveredVals[i];
                await this.updateSelect(this.selectElements[i]);
                continue;
            }
            break;
        }
    }

    existsInOptions(select, savedOption) {
        let selectOptionsArr = Array.from(select.children);
        
        return selectOptionsArr.some(elem => {
            return elem.value == savedOption;
        });
    }
}