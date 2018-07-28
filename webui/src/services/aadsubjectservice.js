import Axios from 'axios/index';
import AuthSvc from './authservice'

const ACCESS_TOKEN_RESOURCE = 'https://graph.windows.net';

export default class AadSubjectService {
    constructor(organizationId) {
        this.httpClient = Axios.create({
            baseURL: `${ACCESS_TOKEN_RESOURCE}/${organizationId}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
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
                // NOTE: Temporarily errHandler function is not used to avoid 403 error code.
                // Instead we use dataHandler to return at least what we have.
                .catch(/*errHandler*/ (err) => {
                    dataHandler(managersChain);
                });
        };

        // Private method is defined in the constructor
        this.getUser = (userResource, dataHandler, errHandler) => {
            AuthSvc.withToken(
                token => {
                    // Unfortunately AAD API does not support $select parameter
                    //      to minimize the request content.
                    this.httpClient
                        .get(userResource, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            params: {
                                'api-version': '1.6'
                            }
                        })
                        .then(resp => dataHandler(resp.data))
                        .catch(err => errHandler(err));
                },
                ACCESS_TOKEN_RESOURCE
            );
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
            // Then retrieve managers chain
            this.getManagersRecursively([user], `/users/${subjectId}`, dataHandler, errHandler);
        }, errHandler);
    }

    // TODO
    // hasDirectReports() { }
    // getDirectReports() { }
}
