export default class TelemetryService {
    setAuthenticatedUser(userId) {
        window.appInsights.setAuthenticatedUserContext(userId);
    }

    clearAuthenticatedUser() {
        window.appInsights.clearAuthenticatedUserContext();
    }

    trackEvent(name, data) {
        window.appInsights.trackEvent(name, data);
    }
}
