const tokenSelector = 'ms_aad_token';

export default {
    state: {
        tokenRefreshedAt: Date       // TODO : use to refresh the token
    },

    mutations: {
        GET_CHANGES(state, payload) {
            state.changes = payload;
        }
    },

    getters: {
        GET_TOKEN() {
            return localStorage.getItem(tokenSelector);
        }
    },

    actions: {
        // Handles current window location parameters to check token existance etc
        HANDLE_CURRENT_LOCATION() {
            // if browser URL contains token:
            //     setToken()
            //     removeTokenFromURL()
            // else
            //     throw exception Unauthorized or start authorization flow again
        },

        // Starts authentication implicit flow
        START_SIGNIN_FLOW() {
            // TODO : take auth config from assets may be
            // TODO : form redirect url using MS ADAL library

            console.log('starting implicit flow..');
            this.$router.push('/hello');
        },

        STORE_TOKEN(token) {
            localStorage.setItem(tokenSelector, token);
        }
    }
}
