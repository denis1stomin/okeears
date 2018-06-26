<template>
    <div class="okr">
        <h3 class="title">OKR Editor</h3>

        <InputForm ref="newObjForm" placeholder="Let's create a new objective"
                   :action="addObjective">
            <span class="input-icon" @click="addObjectiveOnClick()">+</span>
        </InputForm>

        <div class="objectives" v-for="objective in objectives">
            <InputForm placeholder=""
                       :action="editObjective"
                       :value="objective.statement"
                       :objid="objective.id">
                <span class="input-icon" @click="deleteObjective(objective.id)">-</span>
            </InputForm>
        </div>
    </div>
</template>

<script>
    import InputForm from './InputForm'

    export default {
        name: 'OKR',

        components: {InputForm},

        computed: {
            objectives: {
                get() {
                    return this.$store.state.okr.objectives;
                }
            }
        },


        methods: {
            addObjectiveOnClick() {
                this.addObjective(this.$refs.newObjForm.value);
            },

            addObjective(objStatement) {
                this.$store.dispatch('CREATE_OBJECTIVE', {
                    statement: objStatement
                });
            },

            editObjective(objId, objStatement) {
                this.$store.dispatch('EDIT_OBJECTIVE', {
                    id: objId,
                    statement: objStatement
                });
            },

            deleteObjective(objectiveId) {
                this.$store.dispatch('DELETE_OBJECTIVE', objectiveId);
            }
        }
    }
</script>
