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
            <div class="centered-suggestion-message">
                <span>
                    <h1>Okeears</h1><br>
                    OKR process web application<br>
                    Soon you will find some more useful information about the application here.<br><br>
                    Join Okeears community on
                    <a href="https://github.com/denis1stomin/okeears" target="_blank" rel="noopener noreferrer">GitHub</a>
                </span>
            </div>
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
