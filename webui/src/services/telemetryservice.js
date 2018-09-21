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

    trackError(message) {
        // Hack, but works at least in Chrome
        // See https://stackoverflow.com/questions/1013239/can-i-get-the-name-of-the-currently-running-function-in-javascript
        // Probably need to use slice(2) in production where is no parcel's
        // hot module replacing
        const caller = (new Error()).stack.match(/at (\S+)/g)[2].slice(3);

        const trace = message ? message : `Error at ${caller}`;
        const data = { method: caller };
        window.appInsights.trackTrace(trace, data, window.AI.SeverityLevel.Error);
    }
}
