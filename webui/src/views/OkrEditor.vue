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
            <InputForm placeholder="Find people"
                       :action="searchSubjects">
                <SearchIcon/>
            </InputForm>
            <div class="suggested-subjects-list">
                <div v-for="item in suggestedSubjects" class="suggested-subjects-item">{{item.displayName}}</div>
            </div>
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
    import InputForm from './../components/InputForm'
    import OrgTree from './../components/OrgTree'
    import OKR from './../components/OKR'
    import SearchIcon from './../components/Icons/SearchIcon'
    import LogoutIcon from './../components/Icons/LogoutIcon'

    export default {
        components: {LogoutIcon, SearchIcon, InputForm, OrgTree, OKR},

        data() {
            return {
                showSuggestedSubject: false
            }
        },

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

            searchSubjects(query) {
                console.log('search');
                this.$store.dispatch('SEARCH_SUBJECTS', query);
            }
        },

        mounted() {
            this.$store.dispatch('GET_CURRENT_USER');
            this.$store.dispatch('GET_RELEVANT_SUBJECTS');
        }
    }
</script>
