import subjectSvc from './../../services/subjectservice';

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
            // by default an user wants to see her org tree
            state.interestingSubject = payload;
            // by default an user wants to see her objectives
            state.selectedSubject = payload;
        },

        CURRENT_USER_FAILED(state, payload) {
            state.error = payload;
        },

        ORGTREE_COMPLETE(state, payload) {
            state.orgtree = payload;
        },

        ORGTREE_FAILED(state, payload) {
            state.error = payload;
        }
    },

    getters: {
        SELECTED_SUBJECT(state) {
            return state.selectedSubject;
        }
    },

    actions: {
        // Gets current authentificated user
        GET_CURRENT_USER(context) {
            subjectSvc.getCurrentUser(
                data => context.commit('CURRENT_USER_COMPLETE', data),
                err => context.commit('CURRENT_USER_FAILED', err)
            );
        },

        // Searches subjects using text search
        SEARCH_SUBJECTS(context, searchQuery) {
            // TODO : make search query and show most 5-10 found names
        },

        SET_INTERESTING_SUBJECT(context, subject) {
            // store.interestingSubject = subject;
            // GET_ORGTREE for subject
            // SET_SELECTED_SUBJECT as subject
            // GET_OBJECTIVES
        },

        SET_SELECTED_SUBJECT(context, subject) {
        },

        // Gets OrgTree for an interesting subject
        GET_ORGTREE(context) {
            subjectSvc.getSubjectOrgTree(
                context.state.interestingSubject.id,
                data => context.commit('ORGTREE_COMPLETE', data),
                err => context.commit('ORGTREE_FAILED', err)
            );
        }
    }
}
