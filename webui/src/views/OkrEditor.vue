<template>
    <div class="container">
        <header class="header">
            <h2 class="title">OKR Portal</h2>

            <span class="user-name" @click="signOut">Sign Out</span>
            <span class="user-name" >{{user.name}}</span>
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
    import auth from '../store/modules/auth'

    export default {
        components: {SearchIcon, InputForm, OrgTree, OKR},

        computed: {
            user: {
                get() {
                    return this.$store.state.user.me;
                }
            }
        },

        methods: {
            signOut() {
                auth.actions.LOGOUT();
            }
        },

        mounted() {
            this.$store.dispatch('GET_CURRENT_USER');
        }
    }
</script>
