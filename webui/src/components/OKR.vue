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

        <div class="changeLog">
            <p>Change log:</p>
            <div v-for="record in logs">{{record}}</div>
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
            },

            logs: {
                get() {
                    return this.$store.state.audit.changes;
                }
            }
        },

        methods: {
            addObjectiveOnClick() {
                let statement = this.$refs.newObjForm.value;
                this.addObjective(statement);

                this.logChange(`Me created '${statement}'`);
            },

            addObjective(objStatement) {
                this.$store.dispatch('CREATE_OBJECTIVE', {
                    statement: objStatement
                });

                this.logChange(`Me created '${objStatement}'`);
            },

            editObjective(objId, objStatement) {
                this.$store.dispatch('EDIT_OBJECTIVE', {
                    id: objId,
                    statement: objStatement
                });

                this.logChange(`Me changed '${objStatement}'`);
            },

            deleteObjective(objectiveId) {
                this.$store.dispatch('DELETE_OBJECTIVE', objectiveId);

                this.logChange(`Me deleted '${objectiveId}'`);
            },

            logChange(description) {
                this.$store.dispatch('POST_AUDIT_ITEM', description);
            }
        }
    }
</script>
