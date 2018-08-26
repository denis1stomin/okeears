import AuthenticationContext from 'adal-angular'

class AuthService {
    constructor() {
        // TODO: Temporary hack to support testing in node
        // where window.AppConfig is not defined
        const appConfig = window.AppConfig || {auth: {clientId: '00000000-0000-0000-0000-000000000000'}};
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
