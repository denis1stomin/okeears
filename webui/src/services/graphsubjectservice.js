const MicrosoftGraph = require('@microsoft/microsoft-graph-client');

export default class GraphSubjectService {
    constructor() {
        this.ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

        this.getManagersRecursively = function aliasName(managersChain, userResource, tokenProvider, dataHandler, errHandler) {
            let graphClient = MicrosoftGraph.Client.init({
                authProvider: tokenProvider
            });

            graphClient
                .api(`${userResource}/manager`)
                //.select("displayName")
                .get()
                .then((body) => {
                    if (body) {
                        managersChain.unshift(body);
    
                        let nextUserResource = `/users/${body.id}`;
                        aliasName(managersChain, nextUserResource, tokenProvider, dataHandler, errHandler);
                    }
                    else {
                        dataHandler(managersChain);
                    }
                })
                .catch(/*errHandler*/ (err) => {
                    dataHandler(managersChain);
                });
        };

        this.getUser = (userResource, tokenProvider, dataHandler, errHandler) => {
            let graphClient = MicrosoftGraph.Client.init({
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

    getCurrentUser(tokenProvider, dataHandler, errHandler) {
        this.getUser('/me', tokenProvider, dataHandler, errHandler);
    }

    getUserById(subjectId, tokenProvider, dataHandler, errHandler) {
        this.getUser(`/users/${subjectId}`, tokenProvider, dataHandler, errHandler);
    }

    getSubjectOrgTree(subjectId, tokenProvider, dataHandler, errHandler) {
        this.getUserById(subjectId, tokenProvider, (user) => {
            this.getManagersRecursively([user], `/users/${subjectId}`, tokenProvider, dataHandler, errHandler);
        }, errHandler);
    }

    // TODO
    // hasDirectReports() { }
    // getDirectReports() { }
}
