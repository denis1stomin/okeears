<template>
    <div class="key-results" :objective="objective">
        <div class="key-result" v-for="keyresult in objective.keyresults">
            <InputForm placeholder=""
                       :action="editKeyresult"
                       :value="keyresult.statement"
                       :obj="objective"
                       :kr="keyresult">
                <span class="input-icon" @click="deleteKeyresult(objective, keyresult)"><TrashIcon/></span>
            </InputForm>
            <input type="range" min="0" max="100" v-model.number="keyresult.percent" @blur="editPercent(objective, keyresult)"/>
        </div>
        <InputForm ref="newKRForm"
                   placeholder="Let’s create measurable key result"
                   :action="addKeyresult"
                   :obj="objective">
        <span class="input-icon" @click="addKeyresult(objective, $refs.newKRForm.value)">
            <PlusIcon/>
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

        methods: {
            addKeyresult(objective, statement) {
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
