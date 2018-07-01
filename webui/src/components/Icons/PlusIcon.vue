<template>
    <svg class="icon icon-plus" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="22" y1="12" x2="2" y2="12"/>
    </svg>
</template>

<script>
    export default {
        name: "plus-icon"
    }
</script>

<style scoped>
    line {
        stroke-width: 3;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-miterlimit: 10;
    }
</style>