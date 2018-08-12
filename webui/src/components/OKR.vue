<template>
    <div class="okr">
        <div class="loading-objectives-waiter" v-if="currentlyLoading">
            <Spinner/>
        </div>

        <div class="okr-editor" v-else>
            <InputForm class="create-objective-form"
                       ref="newObjForm"
                       placeholder="+ Add ambitious objective"
                       :action="text => { addObjective(text); }"
                       v-if="canChangeOkr">
            </InputForm>

            <div class="error" v-if="error">
                <span>{{error.message}}</span>
            </div>

            <div class="objective-card"
                 v-if="haveVisibleObjectives"
                 v-for="objective in visibleObjectives">

                <div :class="{'objective': !isRemovedObjective(objective.id), 'objective-deleted': isRemovedObjective(objective.id)}"
                     :key="objective.id">

                    <div class="objective-item-header">
                        <div class="objective-like-icon icons-container" @click="objective.like = !objective.like">
                            <StarIcon :class="{'objective-like-icon-selected': objective.like}"/>
                        </div>

                        <div class="objective-icons icons-container">
                            <span v-if="canChangeOkr" @click="deleteObjective(objective.id)"><TrashIcon/></span>
                            <span @click="copyObjective(objective)"><CopyIcon/></span>
                            <span v-if="!canChangeOkr" @click="sendChangeSuggestion(objective)"><SendIcon/></span>
                        </div>
                    </div>

                    <div class="objective-item-body">
                        <InputForm class="objective-title"
                                   placeholder=""
                                   autosave="true"
                                   :readonly="!canChangeOkr"
                                   :action="text => { editObjective(objective, text); }"
                                   :value="objective.statement">
                        </InputForm>

                        <KeyResults :objective="objective" :readonly="!canChangeOkr"/>
                    </div>

                    <div class="objective-restore-layer" v-if="isRemovedObjective(objective.id)">
                        <div class="objective-restore-button" @click="restoreObjective(objective.id)">
                            RESTORE OBJECTIVE
                        </div>
                    </div>
                </div>
            </div>

            <div class="empty-objectives" v-if="!haveVisibleObjectives">
                <div class="objective-card">
                    <div class="objective" v-if="canChangeOkr">
                        <div class="objective-item-header">
                            <div class="objective-like-icon icons-container" @click="objective.like = !objective.like">
                                <StarIcon class="objective-like-icon-selected"/>
                            </div>

                            <div class="objective-icons icons-container">
                                <span @click="copyObjective(landingObjective)"><CopyIcon/></span>
                            </div>
                        </div>

                        <div class="objective-item-body">
                            <InputForm class="objective-title"
                                       placeholder=""
                                       :value="landingObjective.statement" />

                            <KeyResults :objective="landingObjective" :readonly="true"/>
                        </div>
                    </div>
                </div>
                <span v-if="!canChangeOkr">
                    There is no any objective yet. You can send a friendly reminder to your teammate
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
    import KeyResults from './KeyResults'
    import Spinner from './Animation/Spinner'
    
    import { mapState, mapGetters } from 'vuex'

    export default {
        name: 'Objectives',

        components: {TrashIcon, CopyIcon, SendIcon, StarIcon, PlusIcon, InputForm, ChangeLog, KeyResults, Spinner},

        computed: {
            ...mapGetters({
                canChangeOkr: 'CAN_CHANGE_OKR',
                haveVisibleObjectives: 'HAVE_VISIBLE_OBJECTIVES',
                visibleObjectives: 'VISIBLE_OBJECTIVES'
            }),

            ...mapState({
               objectives: state => state.okr.objectives,
               removedObjectives: state => state.okr.removedObjectives,
               landingObjective: state => state.okr.landingObjective,
               error: state => state.okr.error,
               currentlyLoading: state => state.okr.loading,
               selectedSubject: state => state.user.selectedSubject
            })
        },

        methods: {
            addObjective(objStatement) {
                this.$refs.newObjForm.clear();
                this.$store.dispatch('CREATE_OBJECTIVE', {
                    statement: objStatement,
                    keyresults: []
                });
            },

            editObjective(obj, objStatement) {
                this.$store.dispatch('EDIT_OBJECTIVE', {
                    objective: obj,
                    statement: objStatement
                });
            },

            copyObjective(objective) {
                this.$store.dispatch('COPY_OBJECTIVE_TO_CURRENT_USER', {
                    statement: objective.statement + ' COPY'
                });
            },

            deleteObjective(objectiveId) {
                this.$store.dispatch('DELETE_OBJECTIVE', objectiveId);
            },

            isRemovedObjective(objectiveId) {
                const idx = this.$store.state.okr.removedObjectives.findIndex((x) => x.id === objectiveId);
                return (idx > -1);
            },

            restoreObjective(objectiveId) {
                this.$store.dispatch('RESTORE_OBJECTIVE', objectiveId);
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
            }
        }
    }
</script>
