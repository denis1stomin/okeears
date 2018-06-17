<template>
    <form class="search-form">
        <label :for="name"></label>
        <input class="search-input" type="text"
               :id="name"
               :placeholder="placeholder"
               v-model="text"/>
        <div class="search-button">
            <slot/>
        </div>
    </form>
</template>

<script>
    export default {
        name: 'SearchForm',

        props: ['name', 'placeholder'],

        computed: {
            text: {
                get() {
                    return '';
                },

                set(changed) {
                    this.$store.commit('INPUT_CHANGED', {
                        prop: this.name,
                        value: changed
                    })
                }
            }
        }
    }
</script>
