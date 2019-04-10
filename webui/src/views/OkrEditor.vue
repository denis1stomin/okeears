<template>
    <div class="container">
        <header class="header">
            <HeaderTitle></HeaderTitle>

            <div class="header-nav-item">
                <span class="saving-indicator" v-if="currentlySaving">Saving...</span>
                <span class="widescreen" title="Presentation mode" @click="wideScreen"><WideScreenIcon/></span>
                <span class="user-name">{{authenticatedUser.displayName}}</span>
                <span class="log-out" title="Log out" @click="logOut"><LogoutIcon/></span>
            </div>
        </header>
        <div class="menu" v-if="!widescreen">
            <ScopeSelector/>

            <SearchForm/>

            <div class="menu-user" v-if="user.id !== selectedSubject.id"
                 @click="selectInterestingSubject(user)">Return to me</div>

            <OrgTree/>
        </div>

        <div class="user-card" v-if="!widescreen">
            <UserCard/>
        </div>

        <div class="content">
            <OKR/>
        </div>
    </div>
</template>

<script>
    import HeaderTitle from './../components/HeaderTitle'
    import LogoutIcon from './../components/Icons/LogoutIcon'
    import WideScreenIcon from '../components/Icons/WideScreenIcon'
    import ScopeSelector from './../components/ScopeSelector'
    import SearchForm from './../components/SearchForm'
    import UserCard from './../components/UserCard'
    import OrgTree from './../components/OrgTree'
    import OKR from './../components/OKR'

    import { mapState, mapGetters } from 'vuex'

    export default {
        components: {
            HeaderTitle,
            WideScreenIcon,
            LogoutIcon,
            ScopeSelector,
            SearchForm,
            OrgTree,
            UserCard,
            OKR
        },

        computed: {
            ...mapGetters({
                authenticatedUser: 'GET_AUTHENTICATED_USER'
            }),

            ...mapState({
               currentlySaving: state => state.okr.saving,
               selectedSubject: state => state.user.selectedSubject,
               user: state => state.user.me,
               widescreen: state => state.user.widescreen
            })
        },
        methods: {
            wideScreen(){
                this.$store.dispatch('WIDESCREEN_MODE')
            },
            logOut() {
                this.$store.dispatch('LOGOUT');
            },

            selectInterestingSubject(item) {
                this.$store.dispatch('SET_INTERESTING_SUBJECT', item);
            }
        },

        mounted() {
            this.$store.dispatch('LOAD_SCOPES');
            this.$store.dispatch('GET_CURRENT_USER');
            this.$store.dispatch('GET_RELEVANT_SUBJECTS');
        }
    }
</script>
