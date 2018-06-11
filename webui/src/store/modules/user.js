import axios from 'axios/index';

const httpClient = axios.create({
    baseURL: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.1.0',
    headers: {'Accept': 'application/json'}
});

export default {
    state: {
        me: {},

        orgtree: [],

        objectives: [],
        
        error: ''
    },

    mutations: {
        ORGTREE_COMPLETE(state, payload) {
            state.orgtree = payload;
        },

        ORGTREE_FAILED(state, payload) {
            state.error = payload;
        },

        USER_COMPLETE(state, payload) {
            state.me = payload
        },

        USER_FAILED(state, payload) {
            state.error = payload
        },

        OBJECTIVES_COMPLETE(state, payload) {
            state.objectives = payload
        },

        OBJECTIVES_FAILED(state, payload) {
            state.error = payload
        },
    },

    actions: {
        GET_USER(user) {
            httpClient.get('/me')
                .then(response => user.commit('USER_COMPLETE', response.data))
                .catch(error => user.commit('USER_FAILED', error))
        },

        GET_ORGTREE(orgtree) {
            httpClient.get('/me/orgtree')
                .then(response => orgtree.commit('ORGTREE_COMPLETE', response.data))
                .catch(error => orgtree.commit('ORGTREE_FAILED', error))
        },

        GET_OBJECTIVES(orgtree) {
            httpClient.get('/me/objectives')
                .then(response => orgtree.commit('OBJECTIVES_COMPLETE', response.data))
                .catch(error => orgtree.commit('OBJECTIVES_FAILED', error))
        }
    }
}
