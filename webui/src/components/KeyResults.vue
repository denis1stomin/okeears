<template>
    <div class="key-results">
        <div class="key-result" v-for="keyresult in objective.keyresults" :key="keyresult.id">
            <InputForm placeholder=""
                       autosave="true"
                       acceptEmpty="true"
                       :readonly="readonly"
                       :action="text => { editKeyresult(objective, text, keyresult); }"
                       :value="keyresult.statement">
                <span v-if="!readonly" class="input-icon" @click="deleteKeyresult(objective, keyresult)"><TrashIcon/></span>
            </InputForm>

            <input class="key-result-range" type="range" min="0" max="100"
                   v-if="!readonly"
                   v-model.number="keyresult.percent"
                   @blur="editPercent(objective, keyresult)"/>
            <span class="key-result-percents">{{keyresult.percent}}%</span>

            <span class="input-icon"
                  v-if="!readonly"
                  title="Delete key result"
                  @click="deleteKeyresult(objective, keyresult)"><TrashIcon/></span>
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
    import PlusIcon from './Icons/PlusIcon'
    import TrashIcon from './Icons/TrashIcon'

    import { mapGetters } from 'vuex'

    export default {
        name: 'KeyResults',

        components: {InputForm, PlusIcon, TrashIcon},

        props: ['objective', 'readonly'],

        methods: {
            addKeyresult(objective, statement) {
                this.$refs.newKRForm.clear();
                this.$store.dispatch('CREATE_KEYRESULT', {
                    objective: objective,
                    keyresult: {
                        statement: statement,
                        percent: 0
                    }
                })
            },

            editKeyresult(objective, krStatement, keyresult) {
                this.$store.dispatch('EDIT_KEYRESULT', {
                    objective: objective,
                    keyresult: keyresult,
                    krStatement: krStatement,
                    krPercent: keyresult.percent
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
                    krPercent: keyresult.percent
                });
            }
        }
    }
</script>
