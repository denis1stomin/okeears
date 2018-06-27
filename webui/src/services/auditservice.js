class AuditService {
    constructor() {
        this.changesList = [
            '2018-06-27T19:55:57.985Z Dima Bilan has changed an objective',
            '2018-06-27T19:57:57.985Z Dima Bilan has changed another objective'
        ];
    }

    log(changeDescription) {
        this.changesList.push(changeDescription);
    }

    getLogs() {
        return this.changesList;
    }
}

// Single instance pattern
export default new AuditService();
