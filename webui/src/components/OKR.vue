<template>
    <div class="okr">
        <div class="okr-editor">
            <h3 class="title" v-if="canChangeOkr">Plan your objectives and key results</h3>
            <h3 class="title" v-else>Browse {{selectedSubject.displayName}} objectives and key results</h3>

            <InputForm ref="newObjForm"
                       placeholder="Let’s create ambitious objective"
                       :action="addObjective"
                       v-if="canChangeOkr">
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
                    <span v-if="canChangeOkr" @click="deleteObjective(objective.id)"><TrashIcon/></span>
                    <span @click="copyObjective(objective)"><CopyIcon/></span>
                    <span v-if="!canChangeOkr" @click="sendChangeSuggestion(objective)"><SendIcon/></span>
                </div>
            </div>

            <div class="empty-objectives" v-if="!objectives.length">
                <span v-if="canChangeOkr">
                    There is no any objective yet. Let's create a first one right now ^
                </span>
                <span v-else>
                    There is no any objective yet. Let's send a friendly reminder to your teammate 
                    <span @click="sendReminder()"><SendIcon/></span>
                </span>
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
            },

            selectedSubject: {
                get() {
                    return this.$store.state.user.selectedSubject;
                }
            },

            canChangeOkr: {
                get() {
                    return this.$store.getters.CAN_CHANGE_OKR;
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

            copyObjective(objective) {
                this.$store.dispatch('COPY_OBJECTIVE_TO_CURRENT_USER', {
                    // TODO : add COPY only for the same user
                    statement: objective.statement + ' COPY'
                });
            },

            deleteObjective(objId) {
                this.$store.dispatch('DELETE_OBJECTIVE', objId);

                this.logChange(`Me deleted '${objId}'`);
            },

            sendChangeSuggestion(objective) {
                const targetSubject = this.$store.state.user.selectedSubject;
                window.location = `mailto:${targetSubject.mail || targetSubject.userPrincipalName}?
subject=Objective: ${objective.statement}&
body=Hi ${targetSubject.givenName || ''}%2C%0A
Please take a look at your objective '${objective.statement}' on <a href="${window.location}">OKR Portal</a>.`;
            },

            // TODO : check is it safe to invite user to window.location?

            sendReminder() {
                const targetSubject = this.$store.state.user.selectedSubject;
                window.location = `mailto:${targetSubject.mail || targetSubject.userPrincipalName}?
subject=Please fill objectives&
body=Hi ${targetSubject.givenName || ''}%2C%0A
Please fill objectives for the next period on <a href="${window.location}">OKR Portal</a>.`;
            },

            logChange(description) {
                this.$store.dispatch('POST_AUDIT_ITEM', description);
            }
        }
    }
</script>
