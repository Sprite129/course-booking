export default class CourseIdToString {
    constructor(courses) {
        this.courses = courses;
    }

    translate(value) {
        if(isNaN(+value)) {
            const foundCourse = this.courses.find(elem => elem.name == value);
            return foundCourse.id;
        }

        if(!isNaN(+value)) {
            const foundCourse = this.courses.find(elem => elem.id == value);
            return foundCourse.name;
        }

        console.error("Invalid value");
        return;
    }
}