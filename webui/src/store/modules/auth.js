require('./../../appconfig.js');
import AuthenticationContext from 'adal-angular'

const authContext = new AuthenticationContext(window.AppConfig.auth);

export default {

    getters: {
        IS_AUTHENTICATED() {
            return this.GET_USER();
        },

        GET_USER() {
            return authContext.getCachedUser();
        }
    },

    actions: {
        // Handles current window location parameters to check/parse token etc
        HANDLE_CURRENT_LOCATION() {
            if (authContext.isCallback(window.location.hash)) {
                authContext.handleWindowCallback();
            }
        },

        // Acquires access token and then makes an action with the token
        WITH_TOKEN(actionFunc, tokenResource) {
            var user = authContext.getCachedUser();
            if (user && window.parent === window && !window.opener) {
                authContext.acquireToken(tokenResource, (errorDesc, token, error) => {
                    if (error) {
                        console.log(error, errorDesc);
                        authContext.acquireTokenRedirect(tokenResource, null, null);
                    }
                    else {
                        actionFunc(token);
                    }
                });
            }
            else {
                throw 'Do not have ID token yet';
            }
        },

        LOGIN() {
            authContext.login();
        },

        LOGOUT() {
            authContext.logOut();
        }
    }
}
