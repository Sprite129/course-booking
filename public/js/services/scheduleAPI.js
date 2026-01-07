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
        let result = data;

        // Getting needed elements on client side because json-server only allows limited queries
        if(courseID && !courseDay)
            result = this.getDistinctDays(data);
        
        return result;
            
    }

    async getCourses() {
        const response = await fetch(this.coursesUrl);

        if (!response.ok)
            throw new Error(response.status);

        const data = await response.json();
        return data;
    }

    getDistinctDays(scheduleDays) {
        let uniqueDays = [];

        scheduleDays.forEach(elem => {
            const day = elem.day;
            if(uniqueDays.indexOf(day) == -1)
                uniqueDays.push(day);
        });

        return uniqueDays;
    }
}