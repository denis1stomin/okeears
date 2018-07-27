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

        // last error
        error: ''
    },

    getters: {
        CAN_CHANGE_OKR(state) {
            return state.selectedSubject.id === state.me.id;
        }
    },

    mutations: {
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
        // Gets current authentificated user
        GET_CURRENT_USER(context) {
            // Get user basic information from the token
            const rawUser = AuthSvc.getCurrentUser();
            const user = {
                id: rawUser.profile.oid,
                name: rawUser.userName,
                givenName: rawUser.profile.given_name,
                userPrincipalName: rawUser.profile.upn
            };

            context.commit('CURRENT_USER_COMPLETE', user);
            context.dispatch('SET_INTERESTING_SUBJECT', user);
        },

        // Gets list of relevant subjects to current user
        GET_RELEVANT_SUBJECTS(context) {
            SubjectSvc.getCurrentUserRelevantPeople(
                data => context.commit('SUGGESTED_SUBJECTS_LIST', data),
                err => console.log(err)
            );
        },

        // Searches subjects using text search
        SEARCH_SUBJECTS(context, searchQuery) {
            SubjectSvc.findPeople(
                searchQuery,
                data => context.commit('SUGGESTED_SUBJECTS_LIST', data),
                err => console.log(err)
            );
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
            let errorHandler = error => console.log(error);
            SubjectSvc.getSubjectOrgTree(
                context.state.interestingSubject.id,
                data => {
                    data.forEach(user => {
                        user.delvelink = DELVE_LINK_TPL + user.id;
                        user.aadlink = AAD_LINK_TPL + user.id;
                        user.photo = null;

                        SubjectSvc.getUserPhoto(user.id, data => {
                            // Optimization: convert to base64 here and not in the OrgTree component
                            // to have ready-to-use values cached in the user object
                            var base64 = Buffer.from(data).toString('base64');
                            user.photo = 'data:image/jpeg;base64,' + base64;
                        }, errorHandler);

                    });
                    context.commit('ORGTREE_COMPLETE', data)
                }, errorHandler);
        }
    }
}
