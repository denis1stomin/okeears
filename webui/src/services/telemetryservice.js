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

    trackError(message, method) {
        const data = method ? { method: method } : null;
        window.appInsights.trackTrace(message, data, window.AI.SeverityLevel.Error);
    }
}
