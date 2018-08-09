<template>
    <div class="key-results">
        <div class="key-result" v-for="keyresult in objective.keyresults" :key="keyresult.id">
            <InputForm placeholder=""
                       autosave="true"
                       :readonly="!canChangeOkr"
                       :action="text => { editKeyresult(objective, text, keyresult); }"
                       :value="keyresult.statement">
                <span v-if="canChangeOkr" class="input-icon" @click="deleteKeyresult(objective, keyresult)"><TrashIcon/></span>
            </InputForm>

            <input class="key-result-range" type="range" min="0" max="100"
                   v-if="canChangeOkr"
                   v-model.number="keyresult.percent"
                   @blur="editPercent(objective, keyresult)"/>
            <span class="key-result-percents">{{keyresult.percent}}%</span>

            <span class="input-icon"
                  v-if="canChangeOkr"
                  @click="deleteKeyresult(objective, keyresult)"><TrashIcon/></span>
        </div>
        <InputForm ref="newKRForm"
                   v-if="canChangeOkr"
                   placeholder="+ Add measurable key result"
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

        props: ['objective'],

        computed: {
            ...mapGetters({
                canChangeOkr: 'CAN_CHANGE_OKR'
            })
        },

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
