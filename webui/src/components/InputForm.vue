<template>
    <div class="input-form"
         :action="action"
         :value="value">
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

        props: ['name', 'placeholder', 'action', 'value', 'objid'],

        computed: {
            text: {
                get() {
                    return this.value;
                },

                set(changed) {
                    this.value = changed;
                }
            }
        },

        methods: {
            initAction() {
                if (this.objid)
                    return this.action(this.objid, this.value);
                else
                    return this.action(this.value);
            }
        }
    }
</script>
