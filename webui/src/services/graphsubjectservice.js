const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

export default class GraphSubjectService {
    constructor() {
        this.getManagersRecursively = function aliasName(managersChain, userResource, tokenProvider, dataHandler, errHandler) {
            const graphClient = MicrosoftGraph.Client.init({
                authProvider: tokenProvider
            });

            graphClient
                .api(`${userResource}/manager`)
                //.select("displayName")
                .get()
                .then((body) => {
                    if (body) {
                        managersChain.unshift(body);
    
                        const nextUserResource = `/users/${body.id}`;
                        aliasName(managersChain, nextUserResource, tokenProvider, dataHandler, errHandler);
                    }
                    else {
                        dataHandler(managersChain);
                    }
                })
                // NOTE: Temporarily errHandler function is not used to avoid 403 error code.
                // Instead we use dataHandler to return at least what we have.
                .catch(/*errHandler*/ (err) => {
                    dataHandler(managersChain);
                });
        };

        this.getUser = (userResource, tokenProvider, dataHandler, errHandler) => {
            const graphClient = MicrosoftGraph.Client.init({
                authProvider: tokenProvider
            });
    
            graphClient
                .api(userResource)
                //.select("displayName")
                .get()
                .then(dataHandler)
                .catch(errHandler);
        };
    }

    /// Returns MS Graph resource which is needed to acquire an access token for this service
    accessTokenResource() {
        return ACCESS_TOKEN_RESOURCE;
    }

    /// Requests current logged in user information
    getCurrentUser(tokenProvider, dataHandler, errHandler) {
        this.getUser('/me', tokenProvider, dataHandler, errHandler);
    }

    /// Requests user information by its AAD Id field
    getUserById(subjectId, tokenProvider, dataHandler, errHandler) {
        this.getUser(`/users/${subjectId}`, tokenProvider, dataHandler, errHandler);
    }

    /// Requests organizational structure for an user
    getSubjectOrgTree(subjectId, tokenProvider, dataHandler, errHandler) {
        // First get user information
        this.getUserById(subjectId, tokenProvider, (user) => {
            // Then retrieve managers chain
            this.getManagersRecursively([user], `/users/${subjectId}`, tokenProvider, dataHandler, errHandler);
        }, errHandler);
    }

    // TODO
    // hasDirectReports() { }
    // getDirectReports() { }
}
