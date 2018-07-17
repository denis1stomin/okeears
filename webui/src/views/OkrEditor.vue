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
            <InputForm placeholder="Find teammates">
                <SearchIcon/>
            </InputForm>
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

        computed: {
            user: {
                get() {
                    return this.$store.state.user.me;
                }
            }
        },

        methods: {
            logOut() {
                this.$store.dispatch('LOGOUT');
            }
        },

        mounted() {
            this.$store.dispatch('GET_CURRENT_USER');
        }
    }
</script>
