require('./../../appconfig.js');
import AuthenticationContext from 'adal-angular'

//const authConfig = AppConfig['auth'];
const authConfig = {
    tenant: '57a18dd1-7522-4744-8df1-eda5260dc1e8',
    clientId: '6f9caa6b-b5cf-467d-a326-f25cb0aca8f2',
    //redirectUri: 'https://okr.idioma.club/signin',
    redirectUri: 'http://localhost:8000/signin',
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
            return authContext.getCachedUser();
        },

        GET_TOKEN() {
            return '';
        }
    },

    actions: {
        // Handles current window location parameters to check token existance etc
        HANDLE_CURRENT_LOCATION() {
            //if (!config.popUp) {
            //    if (authenticationContext.isCallback(window.location.hash)) {
            //        authenticationContext.handleWindowCallback();
            //    }
            //    else {
            //        var user = authenticationContext.getCachedUser();
            //        if (user && window.parent === window && !window.opener) {
            //            // Display the user
            //            displayUserAndShowSignOutButton(user);
            //
            //            // Call the protected API to show the content of the todo list
            //            acquireAnAccessTokenAndCallTheProtectedService();
            //        }
            //    }
            //}

            //function acquireAnAccessTokenAndCallTheProtectedService() {
            //    showProgress("acquiring an access token for the Web API");
            //    authenticationContext.acquireToken(webApiConfig.resourceId, function (errorDesc, token, error) {
            //        if (error) {
            //            if (config.popUp) {
            //                authenticationContext.acquireTokenPopup(webApiConfig.resourceId, null, null, onAccessToken);
            //            }
            //            else {
            //                authenticationContext.acquireTokenRedirect(webApiConfig.resourceId, null, null);
            //            }
            //        }
            //        else {
            //            onAccessToken(errorDesc, token, error);
            //        }
            //    });
            //}
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
