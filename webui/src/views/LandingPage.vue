<template>
    <div class="container">
        <header class="header">
            <HeaderTitle/>

            <div class="header-nav-item">
                <span class="log-out" @click="logIn">Log in</span>
            </div>
        </header>
        <div class="menu">
            <div class="menu-user" />
        </div>

        <div class="content">
            It is our future Landing page.
        </div>
    </div>
</template>

<script>
    import HeaderTitle from './../components/HeaderTitle'

    export default {
        components: {
            HeaderTitle
        },

        methods: {
            logIn() {
                this.$store.dispatch('LOGIN');
            }
        }
    }
</script>
