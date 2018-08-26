import AuthenticationContext from 'adal-angular'

class AuthService {
    constructor() {
        const appConfig = window.AppConfig || {auth: {clientId: '6f9caa6b-b5cf-467d-a326-f25cb0aca8f2'}};
        this.authContext = new AuthenticationContext(appConfig.auth);
    }

    getCurrentUser() {
        return this.authContext.getCachedUser();
    }

    isAuthenticated() {
        return this.getCurrentUser();
    }

    // Handles current window location parameters to check/parse token etc
    handleCurrentWindowLocation() {
        if (this.authContext.isCallback(window.location.hash)) {
            this.authContext.handleWindowCallback();
        }
    }

    // Acquires access token and then makes an action with the token
    withToken(actionFunc, tokenResource) {
        const user = this.authContext.getCachedUser();
        if (user && window.parent === window && !window.opener) {
            this.authContext.acquireToken(tokenResource, (errorDesc, token, error) => {
                if (error) {
                    console.log(error, errorDesc);
                    this.authContext.acquireTokenRedirect(tokenResource, null, null);
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
        this.authContext.login();
    }

    logout() {
        this.authContext.logOut();
    }
}

// Single instance pattern
export default new AuthService();
