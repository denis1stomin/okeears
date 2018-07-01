require('./../../appconfig.js');
import AuthenticationContext from 'adal-angular'

//const authConfig = AppConfig['auth'];
const authConfig = {
    tenant: '57a18dd1-7522-4744-8df1-eda5260dc1e8',
    clientId: '6f9caa6b-b5cf-467d-a326-f25cb0aca8f2',
    //redirectUri: 'https://okr.idioma.club/signin',
    //redirectUri: 'http://localhost:8000/signin',
    endpoints: [
        'https://graph.microsoft.com'
        //'https://graph.microsoft.com/v1.0/me',
        //'https://graph.microsoft.com/v1.0/users',
        //'https://graph.microsoft.com/v1.0/onenote'
    ]
};
const authContext = new AuthenticationContext(authConfig);

export default {

    getters: {
        IS_AUTHENTICATED() {
            console.log(authContext.getCachedUser());
            return authContext.getCachedUser();
        },

        GET_TOKEN() {
            let resourceId = 'https://graph.microsoft.com';
            authContext.acquireToken(resourceId, (errorDesc, token, error) => {
                if (error) {
                    console.log(error);
                    console.log(errorDesc);
                    //authContext.acquireTokenRedirect(resourceId, null, null);
                }
                else {
                    console.log(token);
                }
            });

            return authContext.getCachedToken(resourceId);
        }
    },

    actions: {
        // Handles current window location parameters to check/parse token etc
        HANDLE_CURRENT_LOCATION() {
            if (!authConfig.popUp) {
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
                //console.log(authContext.getUser());
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
