<template>
    <svg class="icon icon-burger" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r="27"/>
        <line x1="14" y1="15" x2="40" y2="15"/>
        <line x1="10" y1="31" x2="44" y2="31"/>
        <line x1="10" y1="23" x2="44" y2="23"/>
        <line x1="14" y1="39" x2="40" y2="39"/>
    </svg>
</template>

<script>
    export default {
        name: "BurgerIcon"
    }
</script>

<style scoped>
    circle {
        fill: #7d7abc;
    }

    line {
        fill: none;
        stroke: #c88684;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-miterlimit: 10;
    }
</style>
