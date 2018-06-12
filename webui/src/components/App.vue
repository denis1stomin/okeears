<template>
    <div class="container">
        <header class="header">
            <h4 class="title">OKR Portal</h4>

            <span class="user-name">{{user.name}}</span>
        </header>

        <div class="menu">
            <SearchForm/>
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
    import SearchForm from './SearchForm'
    import OrgTree from './OrgTree'
    import OKR from './OKR'

    export default {
        components: {SearchForm, OrgTree, OKR},

        computed: {
            user: {
                get() {
                    return this.$store.state.user.me;
                }
            }
        },

        mounted() {
            this.$store.dispatch("GET_USER");
            this.$store.dispatch("GET_ORGTREE");
            this.$store.dispatch("GET_OBJECTIVES");
        }
    }
</script>
