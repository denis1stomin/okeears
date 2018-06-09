import axios from 'axios/index';

const httpClient = axios.create({
    baseURL: 'https://virtserver.swaggerhub.com/denis1stomin/OKRPortal/0.1.0',
    headers: {'Accept': 'application/json'}
});

export default {
    state: {
        me: {
            name: ''
        },

        orgtree: [],
        
        error: ''
    },

    mutations: {
        ORGTREE_COMPLETE(state, payload) {
            state.orgtree = payload;

            state.orgtree.push(Object.assign({}, state.orgtree[0]));
            state.orgtree.push(Object.assign({}, state.orgtree[0]));
            state.orgtree[1].id = '351393bd-ebae-4d7e-b755-26b148b700d6';
            state.orgtree[1].name = 'Bob Marley';
            state.orgtree[2].id = '7003753e-4337-499d-9daf-bca9756a274b';
            state.orgtree[2].name = 'Dima Bilan';
        },

        ORGTREE_FAILED(state, payload) {
            state.error = payload;
        },

        USER_COMPLETE(state, payload) {
            state.me = payload
        },

        USER_FAILED(state, payload) {
            state.error = payload
        }
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
        }
    }
}
