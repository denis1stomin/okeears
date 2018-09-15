<template>
    <div class="key-results">
        <div class="key-result" v-for="keyresult in objective.keyresults" :key="keyresult.id">
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
                      @click="openChat(objective, keyresult)"><ChatIcon/>
                </span>

                <span class="input-icon"
                      title="Delete key result"
                      @click="deleteKeyresult(objective, keyresult)"><TrashIcon/>
                </span>
            </div>

            <InputForm class="key-result-description"
                       v-if="showDescription"
                       placeholder="Describe result achievement here"
                       autosave="true"
                       acceptEmpty="true"
                       :readonly="readonly"
                       :action="text => { editKeyresult(objective, keyresult.statement, keyresult, text); }"
                       :value="keyresult.description">
            </InputForm>
        </div>

        <InputForm ref="newKRForm"
                   v-if="!readonly"
                   autosave="true"
                   placeholder="+ Type measurable key result and press Enter"
                   :action="text => { addKeyresult(objective, text); }">
        </InputForm>
    </div>
</template>

<script>
    import InputForm from './InputForm'
    import ChatIcon from './Icons/ChatIcon'
    import TrashIcon from './Icons/TrashIcon'

    export default {
        name: 'KeyResults',

        components: {InputForm, ChatIcon, TrashIcon},

        props: ['objective', 'readonly'],

        data() {
            return {
                showDescription: false
            }
        },

        methods: {
            addKeyresult(objective, statement) {
                this.$refs.newKRForm.clear();
                this.$store.dispatch('CREATE_KEYRESULT', {
                    objective: objective,
                    keyresult: {
                        statement: statement,
                        percent: 0,
                        description: ""
                    }
                })
            },

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
            },

            openChat(objective, keyresult) {
                this.showDescription = !this.showDescription;
            }
        }
    }
</script>
