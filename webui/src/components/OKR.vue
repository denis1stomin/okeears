<template>
    <div class="okr">
        <h3 class="title">OKR Editor</h3>

        <InputForm placeholder="Let's create a new Object"
                   :action="addObjective"
                   :init-value="newObjective"
                   objid="id">
            <span class="input-icon">+</span>
        </InputForm>

        <div class="objectives" v-for="objective in objectives">
            <InputForm placeholder=""
                       :action="editObjective"
                       :init-value="objective.statement"
                       :objid="objective.id">
                <span class="input-icon">-</span>
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
            },

            newObjective: {
                get() {
                    return this.$store.state.okr.newObjective;
                }
            }
        },


        methods: {
            addObjective() {
                this.$store.dispatch('ADD_OBJECTIVE', {
                    statement: this.$store.state.okr.newObjective
                });
            },

            editObjective() {
                this.$store.dispatch('EDIT_OBJECTIVE');
            }
        }
    }
</script>
