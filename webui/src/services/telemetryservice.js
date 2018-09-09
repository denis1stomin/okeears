export default class TelemetryService {
    constructor() {
    }

    setUser(userId) {
        window.appInsights.context.user.id = userId;
    }

    trackEvent(name, data) {
        window.appInsights.trackEvent(name, data);
    }
}

