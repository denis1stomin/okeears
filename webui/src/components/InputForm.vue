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
                  @keyup.enter.native="event => onEnterUp(event, text)"
                  @keydown.enter.native="event => onEnterDown(event)" />
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

            onEnterUp(event, text) {
                if (event.shiftKey) {
                    if (!this.multiline) {
                        // Save the data on Shift+Enter only for NON multiline textareas
                        this.actionIfNeeded(text);
                    }
                } else {
                    // Always save the data on clear Enter
                    this.actionIfNeeded(text);
                }
            },

            onEnterDown(event) {
                if (event.shiftKey) {
                    if (!this.multiline) {
                        // Don't need new lines on Shift+Enter for NON multiline textareas
                        this.suppressEnter();
                    }
                } else {
                    // Don't need new lines on clear Enter
                    this.suppressEnter();
                }
            },

            actionIfNeeded(text) {
                if(!this.readonly && (text || this.acceptEmpty)) {
                    this.action(text);
                }
            },

            suppressEnter() {
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
