import AuthSvc from './authservice'

const MicrosoftGraph = require('@microsoft/microsoft-graph-client');
const ACCESS_TOKEN_RESOURCE = 'https://graph.microsoft.com';

const ORGTREE_USER_SELECT = 'id,displayName,jobTitle,officeLocation,givenName,surname,mail,userPrincipalName';
const PEOPLE_SEARCH_SELECT = 'id,displayName,mail,userPrincipalName';
const RELEVANT_PEOPLE_SELECT = 'id,displayName,emailAddresses,userPrincipalName';

export default class GraphSubjectService {
    constructor() {
        this.graphClient = MicrosoftGraph.Client.init({
            // debugLogging: true,
            authProvider: (done) => {
                AuthSvc.withToken((token) => {
                    done(null, token);
                }, ACCESS_TOKEN_RESOURCE);
            }
        });

        // Private method is defined in the constructor
        this.getManagersRecursively = function aliasName(managersChain, userResource, dataHandler, errHandler) {
            this.graphClient
                .api(`${userResource}/manager`)
                .select(ORGTREE_USER_SELECT)
                .get()
                .then((body) => {
                    if (body) {
                        managersChain.unshift(body);
    
                        const nextUserResource = `/users/${body.id}`;
                        aliasName(managersChain, nextUserResource, dataHandler, errHandler);
                    }
                    else {
                        dataHandler(managersChain);
                    }
                })
                // NOTE: Temporarily errHandler function is ignored to avoid 403 error code.
                // Instead we use dataHandler to return at least what we have.
                .catch(/*errHandler*/ (err) => {
                    dataHandler(managersChain);
                });
        };

        // Private method is defined in the constructor
        this.getUser = (userResource, dataHandler, errHandler) => {
            this.graphClient
                .api(userResource)
                .select(ORGTREE_USER_SELECT)
                .get()
                .then(dataHandler)
                .catch(errHandler);
        };
    }

    /// Requests current logged in user information
    getCurrentUser(dataHandler, errHandler) {
        this.getUser('/me', dataHandler, errHandler);
    }

    /// Requests user information by its AAD Id field
    getUserById(subjectId, dataHandler, errHandler) {
        this.getUser(`/users/${subjectId}`, dataHandler, errHandler);
    }

    /// Requests organizational structure for an user
    getSubjectOrgTree(subjectId, dataHandler, errHandler) {
        // First get user information
        this.getUserById(subjectId, (user) => {
            const orgtree = [user];
            // Then retrieve managers chain
            this.getManagersRecursively(orgtree, `/users/${subjectId}`, dataHandler, errHandler);
            // Then get direct reports
            this.getDirectReports(subjectId, reports => orgtree.push(...reports), errHandler);
        }, errHandler);
    }

    getDirectReports(subjectId, dataHandler, errHandler) {
        this.graphClient
            .api(`/users/${subjectId}/directReports`)
            .select(ORGTREE_USER_SELECT)
            .get()
            .then(body => dataHandler(body.value))
            .catch(errHandler);
    }

    getCurrentUserRelevantPeople(dataHandler, errHandler) {
        this.graphClient
            .api('/me/people')
            .version('beta')
            .select(RELEVANT_PEOPLE_SELECT)
            .top(7)
            .get()
            .then((body) => {
                const people = body.value;
                people.forEach(person => {
                    if (person.emailAddresses.length)
                        person.mail = person.emailAddresses[0].address;
                });

                dataHandler(people);
            })
            .catch(errHandler);
    }

    findPeople(textQuery, dataHandler, errHandler) {
        this.graphClient
            .api(`/users`)
            .version('beta')
            .select(PEOPLE_SEARCH_SELECT)
            .filter(`startswith(displayName,'${textQuery}') \
or startswith(givenName,'${textQuery}') \
or startswith(surname,'${textQuery}') \
or startswith(userPrincipalName,'${textQuery}') \
or startswith(mail,'${textQuery}')`)
            .top(7)
            .get()
            .then((body) => {
                dataHandler(body.value);
            })
            .catch(errHandler);
    }

    getUserPhoto(subjectId, dataHandler, errHandler) {
        this.graphClient
            .api(`/users/${subjectId}/photo/$value`)
            .responseType('blob')
            .version('beta')
            .get()
            .then(dataHandler)
            .catch(error => {
                // Graph returns 404 if user does not have photo
                if(error.statusCode == 404) {
                    dataHandler(null);
                } else {
                    errHandler(error);
                }
            });
    }
}
