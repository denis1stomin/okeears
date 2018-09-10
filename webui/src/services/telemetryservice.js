export default class TelemetryService {
    constructor() {
    }

    setUser(user) {
        window.appInsights.setAuthenticatedUserContext(user.id);
    }

    clearUser() {
        window.appInsights.clearAuthenticatedUserContext();
    }

    trackEvent(name, data) {
        window.appInsights.trackEvent(name, data);
    }
}

