<template>
    <div class="input-form">
        <label :for="name"></label>
        <textarea type="text"
                  v-autosize="text"
                  v-model="text"
                  :id="name"
                  :placeholder="placeholder"
                  @keyup.enter="action(text)"
                  @keydown.enter="suppressEnter"/>
        <div class="action-button">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InputForm',

        props: ['name', 'placeholder', 'action', 'value'],

        data() {
            return {
                text: this.value
            }
        },

        methods: {
            suppressEnter(event) {
                event.stopPropagation();
    	        event.preventDefault();
                event.returnValue = false;
                this.text = event.target.value;
            },

            clear() {
                this.text = '';
            }
        }
    }
</script>
