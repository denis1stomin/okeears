import auth from './auth';
import GraphSubjectService from './../../services/graphsubjectservice';

let subjectSvc = new GraphSubjectService(
    window.AppConfig, (done) => {
        // first parameter takes an error if you can't get an access token
        let token = auth.getters.GET_TOKEN();
        // TODO: trick
        done(null, token);
    });

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
            console.log('user complete ***', payload);
            state.me = payload;
            // by default an user wants to see her org tree
            //state.interestingSubject = payload;       // FOR DEMO
            // by default an user wants to see her objectives
            state.selectedSubject = payload;

            // TODO : use setter here !!! and remove from page load
            //this.SET_INTERESTING_SUBJECT(payload);
        },

        CURRENT_USER_FAILED(state, payload) {
            state.error = payload;
        },

        ORGTREE_COMPLETE(state, payload) {
            console.log('orgtree complete ***', payload);
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
            let user = auth.getters.GET_USER();
            context.commit('CURRENT_USER_COMPLETE', {
                id: user.profile.oid,
                name: user.userName,
                displayName: `${user.profile.given_name} ${user.profile.family_name}`
            })
        },

        // Searches subjects using text search
        SEARCH_SUBJECTS(context, searchQuery) {
            // TODO: make search query and show most 5-10 found names
        },

        SET_INTERESTING_SUBJECT(context, subject) {
            commit('INTERESTING_SUBJECT', subject);
            dispatch('GET_ORGTREE');
            dispatch('SET_SELECTED_SUBJECT', subject);
        },

        SET_SELECTED_SUBJECT({commit, dispatch}, subject) {
            commit('SELECTED_SUBJECT', subject);
            dispatch('GET_OBJECTIVES');
        },

        // Gets OrgTree for an interesting subject
        GET_ORGTREE(context) {
            subjectSvc.getSubjectOrgTree(
                context.state.interestingSubject.id,
                data => {
                    // Add current user only for demo
                    let user = Object.assign({}, context.state.me);
                    user.name = user.displayName;
                    user.aadlink = `https://portal.azure.com/#blade/Microsoft_AAD_IAM/UserDetailsMenuBlade/Profile/userId/${user.id}`;
                    user.o365link = `https://portal.azure.com/#blade/Microsoft_AAD_IAM/UserDetailsMenuBlade/Profile/userId/${user.id}`;
                    user.delvelink = `https://nam.delve.office.com/?u=${user.id}`;
                    data.push(user);

                    context.commit('ORGTREE_COMPLETE', data);
                },
                err => commit('ORGTREE_FAILED', err)
            );
        }
    }
}
