import AuthenticationContext from 'adal-angular'
import TelemetryService from './telemetryservice';

const AuthContext = new AuthenticationContext(window.AppConfig.auth);
const telemetry = new TelemetryService();

class AuthService {
    getCurrentUser() {
        return AuthContext.getCachedUser();
    }

    isAuthenticated() {
        return this.getCurrentUser();
    }

    // Handles current window location parameters to check/parse token etc
    handleCurrentWindowLocation() {
        if (AuthContext.isCallback(window.location.hash)) {
            AuthContext.handleWindowCallback();
        }
    }

    // Acquires access token and then makes an action with the token
    withToken(actionFunc, tokenResource) {
        const user = AuthContext.getCachedUser();
        if (user && window.parent === window && !window.opener) {
            AuthContext.acquireToken(tokenResource, (errorDesc, token, error) => {
                if (error) {
                    console.log(error, errorDesc);
                    AuthContext.acquireTokenRedirect(tokenResource, null, null);
                }
                else {
                    actionFunc(token);
                }
            });
        }
        else {
            throw 'Do not have ID token yet';
        }
    }

    login() {
        AuthContext.login();
    }

    logout() {
        AuthContext.logOut();
        telemetry.clearAuthenticatedUser();
    }
}

// Single instance pattern
export default new AuthService();
