class AuditService {
    constructor() {
        this.records = [];
    }

    pushRecord(event) {
        this.records.push(event);
    }

    getRecords() {
        return this.records;
    }
}

// Single instance pattern
export default new AuditService();
