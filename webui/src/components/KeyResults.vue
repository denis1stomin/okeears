<template>
    <div class="key-results">
        <KeyResult v-for="keyresult in objective.keyresults" :key="keyresult.id" 
            :keyresult="keyresult"
            :objective="objective"
            :readonly="readonly"/>

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
    import KeyResult from './KeyResult'

    export default {
        name: 'KeyResults',

        components: { InputForm, KeyResult },

        props: ['objective', 'readonly'],

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
            }        
        }
    }
</script>
