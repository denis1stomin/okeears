<template>
    <svg width="1em" height="1em">
        <use :xlink:href="name + '.1368a4fc.svg'"></use>
    </svg>
</template>

<script>
    import icon from './../assets/svg/search.svg'

    // console.log(icon);
    // const files = require.context('!svg-sprite!./assets', false, /.*\.svg$/).default;
    // files.keys().forEach(files);

    export default {
        name: 'Icon',

        props: ['className', 'name'],

        data() {
            return {
                icon: icon
            }
        }
    }
</script>

<!--<template>-->
    <!--<div v-html="require(`./../assets/svg/${name}.svg`)"></div>-->
<!--</template>-->

<!--<script>-->
    <!--export default {-->
        <!--props: ['name']-->
    <!--}-->
<!--</script>-->
