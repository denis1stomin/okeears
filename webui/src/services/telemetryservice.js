export default class TelemetryService {
    constructor() {
    }

    setUser(user) {
        //TODO: Change to ' = hash(user.id)'
        window.appInsights.context.user.id = user.id;
    }

    trackEvent(name, data) {
        window.appInsights.trackEvent(name, data);
    }
}

