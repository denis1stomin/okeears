<template>
    <div class="container">
        <header class="header">
            <h2 class="title">OKR Portal</h2>

            <span class="user-name">{{user.name}}</span>
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
    import SearchIcon from './Icons/SearchIcon'
    import InputForm from './InputForm'
    import OrgTree from './OrgTree'
    import OKR from './OKR'


    export default {
        components: {SearchIcon, InputForm, OrgTree, OKR},

        computed: {
            user: {
                get() {
                    return this.$store.state.user.me;
                }
            }
        },

        mounted() {
            this.$store.dispatch('GET_CURRENT_USER');
            this.$store.dispatch('GET_ORGTREE');
            this.$store.dispatch('GET_OBJECTIVES');
            this.$store.dispatch('GET_AUDIT_LOGS');
        }
    }
</script>
