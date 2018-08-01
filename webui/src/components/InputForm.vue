<template>
    <div class="input-form"
         :action="action"
         :value="value">
        <label :for="name"></label>
        <input type="text"
               v-model="text"
               :id="name"
               :placeholder="placeholder"
               :obj="obj"
               :kr="kr"
               @keyup.enter="initAction"/>
        <div class="action-button">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InputForm',

        props: ['name', 'placeholder', 'action', 'value', 'obj', 'kr'],

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
                if (this.obj)
                    return this.action(this.obj, this.value, this.kr);
                else
                    return this.action(this.value);
            }
        }
    }
</script>
