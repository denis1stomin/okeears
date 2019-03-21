<template>
    <div class="input-form">
        <label :for="name"></label>
        <textarea-autosize v-if="multiline"
                  type="text"
                  v-model="text"
                  :id="name"
                  :readonly="readonly"
                  :disabled="readonly"
                  :style="{resize: readonly ? 'none' : 'vertical'}"
                  :placeholder="placeholder"
                  @blur="onBlur(text)"
                  @keyup.enter="onEnter(text)"
                  @keydown.enter="suppressEnter"/>
        <textarea v-else
                  type="text"
                  v-model="text"
                  v-autosize="text"
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

        props: ['name', 'placeholder', 'action', 'value', 'autosave', 'readonly', 'acceptEmpty', 'multiline'],

        data() {
            return {
                text: this.value
            }
        },

        methods: {
            onBlur(text) {
                if(this.autosave) {
                    this.saveContent(text);
                }
            },

            onEnter(text) {
                this.saveContent(text);
            },

            saveContent(text) {
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
