<template>
    <div class="container">
        <header class="header">
            <h2 class="title">OKR Portal</h2>

            <div class="header-nav-item">
                <span class="user-name">{{user.name}}</span>
                <span class="log-out" @click="logOut"><LogoutIcon/></span>
            </div>
        </header>

        <div class="menu">
            <SearchForm/>

            <div class="menu-user" @click="selectInterestingSubject(user.name)">{{user.name}}</div>

            <OrgTree/>

            <div class="suggested-subjects-list">
                <div class="suggested-subjects-title">Humans</div>
                <div class="suggested-subjects-item"
                     v-for="item in suggestedSubjects"
                     @click="selectInterestingSubject(item)">{{item.displayName}}
                </div>
            </div>
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

    export default {
        components: {LogoutIcon, SearchForm, OrgTree, OKR},

        computed: {
            user: {
                get() {
                    return this.$store.state.user.me;
                }
            },

            suggestedSubjects: {
                get() {
                    return this.$store.state.user.suggestedSubjectsList;
                }
            }
        },

        methods: {
            logOut() {
                this.$store.dispatch('LOGOUT');
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
