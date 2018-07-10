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
        },

        GET_TOKEN() {
            let resource = window.AppConfig.auth.graphResource;
            return authContext.getCachedToken(resource);
        }
    },

    actions: {
        // Handles current window location parameters to check/parse token etc
        HANDLE_CURRENT_LOCATION() {
            if (authContext.isCallback(window.location.hash)) {
                authContext.handleWindowCallback();
            }
            else {
                var user = authContext.getCachedUser();
                if (user && window.parent === window && !window.opener) {
                    let resource = window.AppConfig.auth.graphResource;
                    authContext.acquireToken(resource, (errorDesc, token, error) => {
                        if (error) {
                            console.log(error, errorDesc);
                            authContext.acquireTokenRedirect(resource, null, null);
                        }
                        else {
                            console.log(token);
                        }
                    });
                }
            }
        },

        LOGIN() {
            console.log('starting auth flow..');
            authContext.login();
        },

        LOGOUT() {
            authContext.logOut();
        }
    }
}
