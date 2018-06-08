<template>
    <div class="container">
        <header class="header">
            <h4 class="title">OKR Portal</h4>

            <span class="user-name">{{user.name}}</span>
        </header>

        <div class="content">
            <SearchForm/>
            <OrgTree/>
        </div>
    </div>
</template>

<script>
    import SearchForm from './SearchForm'
    import OrgTree from './OrgTree'

    export default {
        components: {SearchForm, OrgTree},

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
        }
    }
</script>
