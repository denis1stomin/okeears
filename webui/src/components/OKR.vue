<template>
    <div class="okr">
        <div class="okr-editor">
            <h3 class="title">OKR Editor</h3>

            <InputForm ref="newObjForm"
                       placeholder="Let's create a new objective"
                       :action="addObjective">
                <span class="input-icon" @click="addObjective($refs.newObjForm.value)">+</span>
            </InputForm>

            <div class="objectives" v-if="objectives.length" v-for="objective in objectives">
                <InputForm placeholder=""
                           :action="editObjective"
                           :value="objective.statement"
                           :objid="objective.id">
                    <span class="input-icon" @click="deleteObjective(objective.id)">-</span>
                </InputForm>

                <div class="key-results" v-for="keyresult in objective.keyresults">
                    <span>{{keyresult.statement}}</span>
                </div>
            </div>

            <div v-if="!objectives.length">
                <span>You don't have objectives yet. Let's create first! ;)</span>
            </div>
        </div>

        <ChangeLog/>
    </div>
</template>

<script>
    import InputForm from './InputForm'
    import ChangeLog from './ChangeLog'

    export default {
        name: 'OKR',

        components: {InputForm, ChangeLog},

        computed: {
            objectives: {
                get() {
                    return this.$store.state.okr.objectives;
                }
            }
        },

        methods: {
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

            deleteObjective(objId) {
                this.$store.dispatch('DELETE_OBJECTIVE', objId);

                this.logChange(`Me deleted '${objId}'`);
            },

            logChange(description) {
                this.$store.dispatch('POST_AUDIT_ITEM', description);
            }
        }
    }
</script>
