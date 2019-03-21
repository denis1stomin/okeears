<template>
    <div class="key-result">
        <InputForm placeholder=""
                    autosave="true"
                    acceptEmpty="true"
                    :readonly="readonly"
                    :multiline="true"
                    :action="text => { editKeyresult(objective, text, keyresult, keyresult.description); }"
                    :value="keyresult.statement">
        </InputForm>

        <input class="key-result-range" type="range" min="0" max="100"
                v-if="!readonly"
                v-model.number="keyresult.percent"
                @blur="editPercent(objective, keyresult)" title="percentage"/>
        <span class="key-result-percents">{{keyresult.percent}}%</span>

        <div class="icons-container">
            <span class="input-icon"
                  title="Look at key result description"
                  @click="toggleChat()">
                  <ChatIcon v-if="!keyresult.description"/>
                  <ChatIconActive v-if="keyresult.description"/>
            </span>

            <span class="input-icon"
                  v-if="!readonly"
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
                    :multiline="true"
                    :action="text => { editKeyresult(objective, keyresult.statement, keyresult, text); }"
                    :value="keyresult.description">
        </InputForm>
    </div>
</template>

<script>
    import InputForm from './InputForm'
    import ChatIcon from './Icons/ChatIcon'
    import ChatIconActive from './Icons/ChatIconActive'
    import TrashIcon from './Icons/TrashIcon'

    import TelemetryService from './../services/telemetryservice';
    const telemetry = new TelemetryService();

    export default {
        name: 'KeyResult',

        components: {InputForm, ChatIcon, ChatIconActive, TrashIcon},

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

                telemetry.trackEvent("chatButton", {
                    showDescription: this.showDescription
                });
            }
        }
    }
</script>
