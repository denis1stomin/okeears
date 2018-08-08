<template>
    <div class="key-results">
        <div class="key-result" v-for="keyresult in objective.keyresults">
            <InputForm placeholder=""
                       autosave="true"
                       :action="text => { editKeyresult(objective, text, keyresult); }"
                       :value="keyresult.statement">
                <span v-if="canChangeOkr" class="input-icon" @click="deleteKeyresult(objective, keyresult)"><TrashIcon/></span>
            </InputForm>
            
            <input type="range" min="0" max="100"
                   v-model.number="keyresult.percent"
                   @blur="editPercent(objective, keyresult)"/>
            <span>{{keyresult.percent}}%</span>
        </div>
        <InputForm ref="newKRForm"
                   placeholder="Let’s create measurable key result"
                   :action="text => { addKeyresult(objective, text); }">
        <span class="input-icon" @click="addKeyresult(objective, $refs.newKRForm.text)">
            <PlusIcon v-if="canChangeOkr"/>
        </span>
        </InputForm>
    </div>
</template>

<script>
    import InputForm from './InputForm'
    import PlusIcon from './Icons/PlusIcon'
    import TrashIcon from './Icons/TrashIcon'

    export default {
        name: 'KeyResults',

        components: {InputForm, PlusIcon, TrashIcon},

        props: ['objective'],

        computed: {
            canChangeOkr: {
                get() {
                    return this.$store.getters.CAN_CHANGE_OKR;
                }
            },
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
