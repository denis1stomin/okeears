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

    trackError(message, data) {
        window.appInsights.trackTrace(message, window.appInsights.SeverityLevel.Warning, data);
    }
}
