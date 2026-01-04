export default class scheduleAPI {
    constructor(endpoint, coursesEndpoint) {
        this.url = endpoint;
        this.coursesUrl = coursesEndpoint;
    }

    async getSchedule() {
        const response = await fetch(this.url);

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