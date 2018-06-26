class AuditService {
    constructor() {
        this.changes = [
            'Dima Bilan has changed an objective',
            'Dima Bilan has changed an objective 2'
        ];
    }

    log(changeDescription) {
        this.changes.push(`${new Data()} ${changeDescription}`);
    }

    getLogs(count = 10) {
        return this.changes.slice(-count);
    }
}

// Single instance pattern
export default new AuditService();
