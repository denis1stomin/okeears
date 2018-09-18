<template>
    <div class="key-result">
        <InputForm placeholder=""
                    autosave="true"
                    acceptEmpty="true"
                    :readonly="readonly"
                    :action="text => { editKeyresult(objective, text, keyresult, keyresult.description); }"
                    :value="keyresult.statement">
        </InputForm>

        <input class="key-result-range" type="range" min="0" max="100"
                v-if="!readonly"
                v-model.number="keyresult.percent"
                @blur="editPercent(objective, keyresult)" title="percentage"/>
        <span class="key-result-percents">{{keyresult.percent}}%</span>

        <div class="icons-container" v-if="!readonly">
            <span class="input-icon"
                    title="Look at key result description"
                    @click="toggleChat()"><ChatIcon/>
            </span>

            <span class="input-icon"
                    title="Delete key result"
                    @click="deleteKeyresult(objective, keyresult)"><TrashIcon/>
            </span>
        </div>

        <InputForm class="key-result-description"
                    v-if="showDescription"
                    placeholder="+ Result achievement description"
                    autosave="true"
                    acceptEmpty="true"
                    :name="keyresult.id"
                    :readonly="readonly"
                    :action="text => { editKeyresult(objective, keyresult.statement, keyresult, text); }"
                    :value="keyresult.description">
        </InputForm>
    </div>
</template>

<script>
    import InputForm from './InputForm'
    import ChatIcon from './Icons/ChatIcon'
    import TrashIcon from './Icons/TrashIcon'

    export default {
        name: 'KeyResult',

        components: {InputForm, ChatIcon, TrashIcon},

        props: ['objective', 'keyresult', 'readonly'],

        data() {
            return {
                showDescription: false
            }
        },

        methods: {
            editKeyresult(objective, krStatement, keyresult, krDescription) {
                this.$store.dispatch('EDIT_KEYRESULT', {
                    objective: objective,
                    keyresult: keyresult,
                    krStatement: krStatement,
                    krPercent: keyresult.percent,
                    krDescription: krDescription
                });
            },

            deleteKeyresult(objective, keyresult) {
                this.$store.dispatch('DELETE_KEYRESULT', {
                    objective: objective,
                    keyresult: keyresult
                })
            },

            editPercent(objective, keyresult) {
                this.$store.dispatch('EDIT_KEYRESULT', {
                    objective: objective,
                    keyresult: keyresult,
                    krStatement: keyresult.statement,
                    krPercent: keyresult.percent,
                    krDescription: keyresult.description
                });

                // TODO: Need to close sibling's chat here (if any) by emitting an event or smth. like this 
                this.showDescription = true;
            },

            toggleChat() {
                this.showDescription = !this.showDescription;
            }
        }
    }
</script>
