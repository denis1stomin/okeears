import AuthSvc from './../../services/authservice'
import GraphSubjectService from './../../services/graphsubjectservice'

const DELVE_LINK_TPL = 'https://nam.delve.office.com/?u=';
const AAD_LINK_TPL = 'https://portal.azure.com/#blade/Microsoft_AAD_IAM/UserDetailsMenuBlade/Profile/userId/';

const SubjectSvc = new GraphSubjectService();

export default {
    state: {
        // current authentificated user
        me: {},

        // an interesting subject for current user (be default the user himself)
        interestingSubject: {},

        // org tree for the interesting subject
        orgtree: [],

        // selected subject (a single item from current org tree)
        selectedSubject: {},

        // list of subjects which could be interesting to current user
        suggestedSubjectsList: [],

        // query is used to search interesting people
        searchQuery: '',

        // last error
        error: ''
    },

    getters: {
        CAN_CHANGE_OKR(state) {
            return state.selectedSubject.id === state.me.id;
        },

        GET_AUTHENTICATED_USER() {
            // Get user basic information from the token
            const rawUser = AuthSvc.getCurrentUser();
            const user = {
                id: rawUser.profile.oid,
                displayName: rawUser.userName,
                userPrincipalName: rawUser.profile.upn
            };

            return user;
        }
    },

    mutations: {
        CHANGE_SEARCH_QUERY(state, value) {
            state.searchQuery = value;
        },

        CURRENT_USER_COMPLETE(state, value) {
            state.me = value;
        },

        CURRENT_USER_FAILED(state, value) {
            state.error = value;
        },

        ORGTREE_COMPLETE(state, value) {
            state.orgtree = value;
        },

        ORGTREE_FAILED(state, value) {
            state.error = value;
        },

        SUGGESTED_SUBJECTS_LIST(state, value) {
            state.suggestedSubjectsList = value;
        },

        INTERESTING_SUBJECT(state, value) {
            state.interestingSubject = value;
        },

        SELECTED_SUBJECT(state, value) {
            state.selectedSubject = value;
        }
    },

    actions: {
        // Gets current user information
        GET_CURRENT_USER(context) {
            SubjectSvc.getCurrentUser(
                user => {
                    context.commit('CURRENT_USER_COMPLETE', user);
                    context.dispatch('SET_INTERESTING_SUBJECT', user);
                },
                err => console.log(err)
            );
        },

        // Gets list of relevant subjects to current user
        GET_RELEVANT_SUBJECTS(context) {
            SubjectSvc.getCurrentUserRelevantPeople(
                data => context.commit('SUGGESTED_SUBJECTS_LIST', data),
                err => console.log(err)
            );
        },

        // Searches subjects using text search
        // Returns relevant people list if the search query is empty
        SEARCH_SUBJECTS({state, commit, dispatch}, searchQuery) {
            commit('CHANGE_SEARCH_QUERY', searchQuery);

            if (state.searchQuery.length) {
                SubjectSvc.findPeople(
                    searchQuery,
                    data => commit('SUGGESTED_SUBJECTS_LIST', data),
                    err => console.log(err)
                );
            } else {
                dispatch('GET_RELEVANT_SUBJECTS');
            }
        },

        SET_INTERESTING_SUBJECT(context, subject) {
            context.commit('INTERESTING_SUBJECT', subject);
            context.dispatch('GET_ORGTREE');
            context.dispatch('SET_SELECTED_SUBJECT', subject);
        },

        SET_SELECTED_SUBJECT(context, subject) {
            context.commit('SELECTED_SUBJECT', subject);
            context.dispatch('GET_OBJECTIVES');
        },

        // Gets OrgTree for an interesting subject
        GET_ORGTREE(context) {
            const errorHandler = error => console.log(error);
            SubjectSvc.getSubjectOrgTree(
                context.state.interestingSubject.id,
                data => {
                    data.forEach(elem => {
                        elem.delvelink = DELVE_LINK_TPL + elem.id;
                        elem.aadlink = AAD_LINK_TPL + elem.id;
                        elem.photo = null;

                        SubjectSvc.getUserPhoto(elem.id, data => {
                            if (data) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    elem.photo = reader.result;
                                };
                                // data is Blob on Mac/Chrome and Uint8Array on Windows/Chrome
                                data = data instanceof Blob ? data : new Blob([data]);
                                reader.readAsDataURL(data);
                            }
                            else {
                                elem.photo = null;
                            }
                        }, errorHandler);
                    });

                    context.commit('ORGTREE_COMPLETE', data);
                }, errorHandler);
        }
    }
}
