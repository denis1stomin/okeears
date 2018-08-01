<template>
    <div class="key-results" :objective="objective">
        <InputForm ref="newKRForm"
                   placeholder="Let’s create new key result"
                   :action="addKeyresult"
                   :obj="objective">
                <span class="input-icon" @click="addKeyresult(objective, $refs.newKRForm.value)">
                    <PlusIcon/>
                </span>
        </InputForm>
        <div class="key-result" v-for="keyresult in objective.keyresults">
            <InputForm placeholder=""
                       :action="editKeyresult"
                       :value="keyresult.statement"
                       :obj="objective"
                       :kr="keyresult">
                <span class="input-icon" @click="deleteKeyresult(objective, keyresult)"><TrashIcon/></span>
            </InputForm>
        </div>
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
            addKeyresult(objective, krStatement) {
                this.$store.commit('CHANGE_TARGET_OBJECTIVE', objective);
                this.$store.dispatch('CREATE_KEYRESULT', {
                    statement: krStatement
                })
            },

            editKeyresult(objective, krStatement, keyresult) {
                this.$store.commit('CHANGE_TARGET_OBJECTIVE', objective);
                this.$store.dispatch('EDIT_KEYRESULT', {
                    keyresult: keyresult,
                    statement: krStatement
                });
            },

            deleteKeyresult(objective, keyresult) {
                this.$store.commit('CHANGE_TARGET_OBJECTIVE', objective);
                this.$store.dispatch('DELETE_KEYRESULT', keyresult)
            }
        }
    }
</script>
