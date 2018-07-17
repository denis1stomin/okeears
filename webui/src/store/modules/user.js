import auth from './auth';
import GraphSubjectService from './../../services/graphsubjectservice';

let subjectSvc = new GraphSubjectService();

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

        // last error
        error: ''
    },

    mutations: {
        CURRENT_USER_COMPLETE(state, payload) {
            state.me = payload;
        },

        CURRENT_USER_FAILED(state, payload) {
            state.error = payload;
        },

        ORGTREE_COMPLETE(state, payload) {
            state.orgtree = payload;
        },

        ORGTREE_FAILED(state, payload) {
            state.error = payload;
        },

        INTERESTING_SUBJECT(state, payload) {
            state.interestingSubject = payload;
        },

        SELECTED_SUBJECT(state, payload) {
            state.selectedSubject = payload;
        }
    },

    // getters: {
    //     GET_SELECTED_SUBJECT(state) {
    //         return state.selectedSubject;
    //     }
    // },

    actions: {
        // Gets current authentificated user
        GET_CURRENT_USER(context) {
            // Get user basic information from the token
            const rawUser = auth.getters.GET_USER();
            const user = {
                id: rawUser.profile.oid,
                name: rawUser.userName
            };

            context.commit('CURRENT_USER_COMPLETE', user);
            context.dispatch('SET_INTERESTING_SUBJECT', user);
        },

        // Searches subjects using text search
        SEARCH_SUBJECTS(context, searchQuery) {
            // TODO: make search query and show most 5-10 found names
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
            auth.actions.WITH_TOKEN((token) => {
                subjectSvc.getSubjectOrgTree(
                    context.state.interestingSubject.id,
                    (done) => {
                        done(null, token);
                    },
                    data => context.commit('ORGTREE_COMPLETE', data),
                    err => console.log(err)
                );
            }, subjectSvc.accessTokenResource());
        }
    }
}
