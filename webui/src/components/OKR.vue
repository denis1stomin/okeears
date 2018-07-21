<template>
    <div class="okr">
        <div class="okr-editor">
            <h3 class="title">Plan your objectives and key results</h3>

            <InputForm ref="newObjForm"
                       placeholder="Let’s create ambitious objective"
                       :action="addObjective">
                <span class="input-icon" @click="addObjective($refs.newObjForm.value)">
                    <PlusIcon/>
                </span>
            </InputForm>

            <div class="error" v-if="error">
                <span>{{error.message}}</span>
            </div>

            <div class="objectives" v-if="objectives.length" v-for="objective in objectives">
                <InputForm placeholder=""
                           :action="editObjective"
                           :value="objective.statement"
                           :objid="objective.id">
                </InputForm>

                <div class="key-results">
                    <div class="key-result" v-if="objective.keyresults.length"
                         v-for="keyresult in objective.keyresults">
                        <span>{{keyresult.statement}}</span>
                    </div>

                    <div class="empty-key-results" v-if="!objective.keyresults">
                        Key result I want to achieve
                    </div>
                </div>

                <div class="objective-like-icon" @click="objective.like = !objective.like">
                    <StarIcon :class="{'objective-like-icon-selected': objective.like}"/>
                </div>

                <div class="objective-icons">
                    <span @click="deleteObjective(objective.id)"><TrashIcon/></span>
                    <span><CopyIcon/></span>
                    <span><SendIcon/></span>
                </div>
            </div>

            <div class="empty-objectives" v-if="!objectives.length">
                <span>There is no any objective yet. You can create first or suggest your teammate to do it</span>
                <SendIcon/>
            </div>

        </div>

        <ChangeLog/>
    </div>
</template>

<script>
    import TrashIcon from './Icons/TrashIcon'
    import CopyIcon from './Icons/CopyIcon'
    import SendIcon from './Icons/SendIcon'
    import StarIcon from './Icons/StarIcon'
    import PlusIcon from './Icons/PlusIcon'
    import InputForm from './InputForm'
    import ChangeLog from './ChangeLog'

    export default {
        name: 'OKR',

        components: {TrashIcon, CopyIcon, SendIcon, StarIcon, PlusIcon, InputForm, ChangeLog},

        computed: {
            objectives: {
                get() {
                    return this.$store.state.okr.objectives;
                }
            },
            error: {
                get() {
                    return this.$store.state.okr.error;
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
