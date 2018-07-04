require('./../../appconfig.js');
import AuthenticationContext from 'adal-angular'

const authContext = new AuthenticationContext(window.AppConfig.auth);

export default {

    getters: {
        IS_AUTHENTICATED() {
            return this.GET_USER();
        },

        GET_USER() {
            console.log(authContext.getCachedUser());
            return authContext.getCachedUser();
        },

        GET_TOKEN() {
            //let resourceId = 'https://graph.microsoft.com';
            let resourceId = window.AppConfig.auth.loginResource;
            authContext.acquireToken(resourceId, (errorDesc, token, error) => {
                if (error) {
                    console.log(error);
                    console.log(errorDesc);
                    //authContext.acquireTokenRedirect(resourceId, null, null);
                }
                else {
                    //console.log(token);
                }
            });

            return authContext.getCachedToken(resourceId);
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
                    acquireAnAccessTokenAndCallTheProtectedService();
                }
            }
            console.log(authContext.getCachedUser());
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
