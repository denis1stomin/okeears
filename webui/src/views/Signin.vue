<template>
    <div class="signin">Signing you in...</div>
</template>

<script>
    export default {
        name: 'signin',

        mounted() {
            this.$auth.handleAuthentication().then((data) => {
                this.$router.push({ name: 'home' })
            })
        }
    }
</script>
