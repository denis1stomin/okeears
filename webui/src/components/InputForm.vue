<template>
    <div class="input-form">
        <label :for="name"></label>
        <textarea type="text"
                  v-autosize="text"
                  v-model="text"
                  :id="name"
                  :readonly="readonly"
                  :disabled="readonly"
                  :style="{resize: readonly ? 'none' : 'vertical'}"
                  :placeholder="placeholder"
                  @blur="onBlur(text)"
                  @keyup.enter="onEnter(text)"
                  @keydown.enter="suppressEnter"/>
        <div class="action-button">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InputForm',

        props: ['name', 'placeholder', 'action', 'value', 'autosave', 'readonly', 'acceptEmpty'],

        data() {
            return {
                text: this.value
            }
        },

        methods: {
            onBlur(text) {
                if(this.autosave) {
                    this.onEnter(text);
                }
            },

            onEnter(text) {
                if(!this.readonly && (text || this.acceptEmpty)) {
                    this.action(text);
                }
            },

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
