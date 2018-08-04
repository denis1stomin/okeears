<template>
    <div class="container">
        <header class="header">
            <h2 class="title">Okeears</h2>

            <div class="header-nav-item">
                <span class="user-name">{{authenticatedUser.displayName}}</span>
                <span class="log-out" @click="logOut"><LogoutIcon/></span>
            </div>
        </header>

        <div class="menu">
            <SearchForm/>

            <div class="menu-user" @click="selectInterestingSubject(user)">{{user.displayName}}</div>

            <OrgTree/>
        </div>

        <div class="content">
            <OKR/>
        </div>

        <footer class="footer">
            @idioma
        </footer>
    </div>
</template>

<script>
    import SearchForm from './../components/SearchForm'
    import OrgTree from './../components/OrgTree'
    import OKR from './../components/OKR'
    import LogoutIcon from './../components/Icons/LogoutIcon'
    
    import AuthSvc from './../services/authservice'

    export default {
        components: {LogoutIcon, SearchForm, OrgTree, OKR},

        computed: {
            authenticatedUser: {
                get() {
                    return this.$store.getters.GET_AUTHENTICATED_USER;
                }
            },

            user: {
                get() {
                    return this.$store.state.user.me;
                }
            }
        },

        methods: {
            logOut() {
                this.$store.dispatch('LOGOUT');
                AuthSvc.logout();
            },

            selectInterestingSubject(item) {
                this.$store.dispatch('SET_INTERESTING_SUBJECT', item);
            }
        },

        mounted() {
            this.$store.dispatch('GET_CURRENT_USER');
            this.$store.dispatch('GET_RELEVANT_SUBJECTS');
        }
    }
</script>
