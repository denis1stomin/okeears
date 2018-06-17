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

        props: ['name', 'placeholder', 'type'],

        computed: {
            text: {
                get() {
                    return this.$store.state.okr.newObjective;
                },

                set(changed) {
                    this.$store.commit('CREATE_OBJECTIVE', {
                        prop: this.type,
                        statement: changed
                    })
                }
            }
        }
    }
</script>
