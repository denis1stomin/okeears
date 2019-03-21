<template>
    <div class="input-form">
        <label :for="name"></label>
        <textarea-autosize type="text"
                  v-model="text"
                  :id="name"
                  :readonly="readonly"
                  :disabled="readonly"
                  :style="{resize: readonly ? 'none' : 'vertical'}"
                  :placeholder="placeholder"
                  @blur.native="onBlur(text)"
                  @keyup.enter.native="onEnter(text)"
                  @keydown.enter.native="suppressEnter"/>
        <div class="action-button">
            <slot/>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'InputForm',

        props: ['name', 'placeholder', 'action', 'value', 'autosave', 'readonly', 'acceptEmpty', 'multiline'],

        data() {
            return {
                text: this.value
            }
        },

        methods: {
            onBlur(text) {
                if(this.autosave) {
                    this.actionIfNeeded(text);
                }
            },

            onEnter(text) {
                // Save the data on Enter only for NON multiline textareas
                if (!this.multiline) {
                    this.actionIfNeeded(text);
                }
            },

            actionIfNeeded(text) {
                if(!this.readonly && (text || this.acceptEmpty)) {
                    this.action(text);
                }
            },

            suppressEnter(event) {
                // Save the data on Enter only for NON multiline textareas
                if (!this.multiline) {
                    event.stopPropagation();
    	            event.preventDefault();
                    event.returnValue = false;
                    this.text = event.target.value;
                }
            },

            clear() {
                this.text = '';
            }
        }
    }
</script>
