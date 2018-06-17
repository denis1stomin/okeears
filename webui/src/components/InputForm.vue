<template>
    <div class="input-form"
         :action="action"
         :initValue="initValue">
        <label :for="name"></label>
        <input type="text"
               v-model="text"
               :id="name"
               :placeholder="placeholder"
               @keyup.enter="initAction"/>
        <div class="action-button" @click="initAction">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InputForm',

        props: ['name', 'placeholder', 'action', 'initValue'],

        computed: {
            text: {
                get() {
                    return this.initValue;
                },

                set(changed) {
                    this.$store.commit('CHANGE_INPUT', changed);
                }
            }
        },

        methods: {
            initAction() {
                return this.action();
            }
        }
    }
</script>
