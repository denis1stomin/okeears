<template>
    <div class="signin">Signing you in...</div>
</template>

<script>
    export default {
        mounted() {
            console.log('lalalla');
            //this.$auth.handleAuthentication().then((data) => {
            //    this.$router.push({ name: 'home' })
            //});

            this.$router.push({ name: 'home' });
        }
    }
</script>
