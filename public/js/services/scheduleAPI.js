export default class scheduleAPI {
    constructor(endpoint, coursesEndpoint) {
        this.url = endpoint;
        this.coursesUrl = coursesEndpoint;
    }

    async getSchedule(courseID, courseDay) {
        let urlDetailed = this.url;

        if(courseID)
            urlDetailed += "?courseId=" + courseID;
        if(courseDay)
            urlDetailed += "&day=" + courseDay;

        const response = await fetch(urlDetailed);

        if (!response.ok)
            throw new Error(response.status);

        const data = await response.json();
        return data;
    }

    async getCourses() {
        const response = await fetch(this.coursesUrl);

        if (!response.ok)
            throw new Error(response.status);

        const data = await response.json();
        return data;
    }
}