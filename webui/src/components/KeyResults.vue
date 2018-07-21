<template>
    <div class="key-results" :objective="objective">
        <InputForm ref="newKRForm"
                   placeholder="Let’s create new key result"
                   :action="addKeyResult">
                <span class="input-icon" @click="addKeyResult(objective, $refs.newKRForm.value)">
                    <PlusIcon/>
                </span>
        </InputForm>
        <div class="key-result" v-for="keyresult in objective.keyresults">
            <span>{{keyresult.statement}}</span>
        </div>
    </div>
</template>

<script>
    import InputForm from './InputForm'
    import PlusIcon from './Icons/PlusIcon'

    export default {
        name: 'KeyResults',

        components: {InputForm, PlusIcon},

        props: ['objective'],

        methods: {
            addKeyResult(objective, krStatement) {
                this.$store.commit('CHANGE_TARGET_OBJECTIVE', objective);
                this.$store.dispatch('CREATE_KEYRESULT', {
                    statement: krStatement
                })
            }
        }
    }
</script>
