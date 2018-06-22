<template>
    <div class="input-form"
         :action="action"
         :initValue="initValue">
        <label :for="name"></label>
        <input type="text"
               v-model="text"
               :id="name"
               :placeholder="placeholder"
               :objid="objid"
               @keyup.enter="initAction"/>
        <div class="action-button">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InputForm',

        props: ['name', 'placeholder', 'action', 'initValue', 'objid'],

        computed: {
            text: {
                get() {
                    return this.initValue;
                },

                set(changed) {
                    this.$store.commit('CHANGE_INPUT', {
                        id: this.objid || 'id',
                        value: changed
                    });
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
