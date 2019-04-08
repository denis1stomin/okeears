<template>
    <div class="container">
        <header class="header">
            <h2 class="title">
                <a href="https://www.google.com/search?q=Okeears+OKR+process+web+application"
                   target="_blank" rel="noopener noreferrer">Okeears</a>
            </h2>

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
    export default {
        methods: {
            logIn() {
                this.$store.dispatch('LOGIN');
            }
        }
    }
</script>
