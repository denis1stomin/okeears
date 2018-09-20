<template>
    <div class="okr">
        <div class="loading-objectives-waiter" v-if="currentlyLoading">
            <Spinner/>
        </div>

        <div class="centered-suggestion-message"
             v-if="!currentlyLoading && invalidOneDriveForBusinessLicense">
            <span>
                It looks like there is no active
                <a href="https://blogs.business.microsoft.com/en-my/2017/05/22/what-is-onedrive-for-business/" target="_blank" rel="noopener noreferrer">OneDrive For Business</a>
                license for the user {{selectedSubject.userPrincipalName}}.<br/>
                You can go to
                <a href="https://portal.office.com/" target="_blank" rel="noopener noreferrer">Office 365 Portal</a>
                to check for appropriate OneDrive For Business license or to activate it.
            </span>
        </div>

        <div class="okr-editor" v-if="!currentlyLoading && !invalidOneDriveForBusinessLicense">
            <InputForm class="create-objective-form"
                       ref="newObjForm"
                       placeholder="+ Type ambitious objective and press Enter"
                       :action="text => { addObjective(text); }"
                       v-if="canChangeOkr">
            </InputForm>

            <div class="error" v-if="error">
                <span>{{error.message}}</span>
            </div>

            <div class="objective-card"
                 v-if="haveVisibleObjectives"
                 v-for="objective in visibleObjectives" 
                 :key="objective.id">

                <div :class="{'objective': !isRemovedObjective(objective.id), 'objective-deleted': isRemovedObjective(objective.id)}">

                    <div class="objective-item-header">
                        <div class="objective-like-icon icons-container" @click="objective.like = !objective.like">
                            <StarIcon :class="{'objective-like-icon-selected': objective.like}"/>
                        </div>

                        <div class="objective-icons icons-container">
                            <span v-if="!canChangeOkr"
                                  title="Send suggestion email"
                                  @click="sendChangeSuggestion(objective)"><SendIcon/></span>
                            <span title="Duplicate objective"
                                  @click="copyObjective(objective)"><CopyIcon/></span>
                            <span v-if="canChangeOkr"
                                  title="Delete objective"
                                  @click="deleteObjective(objective.id)"><TrashIcon/></span>
                        </div>
                    </div>

                    <div class="objective-item-body">
                        <InputForm class="objective-title"
                                   placeholder=""
                                   autosave="true"
                                   accept-empty="true"
                                   :readonly="!canChangeOkr"
                                   :action="text => { editObjective(objective, text); }"
                                   :value="objective.statement">
                        </InputForm>

                        <KeyResults :objective="objective" :readonly="!canChangeOkr">
                        </KeyResults>

                        <div class="objective-additional-info">
                            <span class="objective-additional-info-text">
                                {{getLastChangedMessage(objective.lastModifiedDateTime)}}
                            </span>
                            <a title="View objective in Microsoft OneNote"
                               :href="objective.onenoteWebUrl" target="_blank" rel="noopener noreferrer">
                                <img class="objective-additional-info-o365"
                                     src="https://weuofficehome.msocdn.com/s/7047452e/Images/favicon_metro.ico" />
                            </a>
                        </div>
                    </div>

                    <div class="objective-restore-layer" v-if="isRemovedObjective(objective.id)">
                        <div class="objective-restore-button" @click="restoreObjective(objective.id)">
                            RESTORE
                        </div>
                        <div class="objective-restore-separator">|</div>
                        <div class="objective-delete-button" @click="purgeObjective(objective.id)">
                            DELETE
                        </div>
                    </div>
                </div>
            </div>

            <div class="empty-objectives" v-if="!haveVisibleObjectives">
                <div class="centered-suggestion-message" v-if="canChangeOkr">
                    <span>
                        Here is no any objective yet.<br/>
                        Let's create your first ambitious objective right now
                    </span>
                </div>
                <div class="centered-suggestion-message" v-else>
                    <span>
                        There is no any objective yet.<br/>
                        You can send a friendly reminder to your teammate
                        <span title="Send reminder email"
                              @click="sendReminder()"><SendIcon/></span>
                    </span>
                </div>
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

    import TelemetryService from './../services/telemetryservice';
    const telemetry = new TelemetryService();

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
               error: state => state.okr.error,
               currentlyLoading: state => state.okr.loading,
               selectedSubject: state => state.user.selectedSubject,
               invalidOneDriveForBusinessLicense: state => state.okr.invalidOneDriveForBusinessLicense
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
                const objectiveCopy = {
                    statement: objective.statement,
                    // Make deep copy below
                    keyresults: JSON.parse(JSON.stringify(objective.keyresults))
                };
                objectiveCopy.keyresults.forEach(
                    each => { each.percent = 0; }
                );

                this.$store.dispatch('COPY_OBJECTIVE_TO_CURRENT_USER', objectiveCopy);
            },

            deleteObjective(objectiveId) {
                // Send remove request only if we have real objective page id.
                // We need it to avoid invalid Onenote API requests.
                if (!objectiveId.startsWith('temp')) {
                    this.$store.dispatch('DELETE_OBJECTIVE', objectiveId);
                }
            },

            isRemovedObjective(objectiveId) {
                const idx = this.$store.state.okr.removedObjectives.findIndex((x) => x.id === objectiveId);
                return (idx > -1);
            },

            restoreObjective(objectiveId) {
                this.$store.dispatch('RESTORE_OBJECTIVE', objectiveId);
            },

            purgeObjective(objectiveId) {
                this.$store.dispatch('PURGE_OBJECTIVE', objectiveId);
            },

            sendChangeSuggestion(objective) {
                const targetSubject = this.$store.state.user.selectedSubject;
                window.location = `mailto:${targetSubject.mail || targetSubject.userPrincipalName}?
subject=Objective: ${objective.statement}&
body=Hi ${targetSubject.givenName || ''}%2C%0A
Please take a look at your objective '${objective.statement}' on ${window.location}.`;

                telemetry.trackEvent("buttonObjectiveEmail");
            },

            // TODO : check is it safe to invite user to window.location?

            sendReminder() {
                const targetSubject = this.$store.state.user.selectedSubject;
                window.location = `mailto:${targetSubject.mail || targetSubject.userPrincipalName}?
subject=Please fill objectives&
body=Hi ${targetSubject.givenName || ''}%2C%0A
Please fill objectives for the next period on ${window.location}.`;

                telemetry.trackEvent("buttonReminderEmail");
            },

            getLastChangedMessage(timestamp) {
                const parsed = new Date(timestamp);
                return `Updated ${parsed.toLocaleDateString()} at ${parsed.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
            }
        }
    }
</script>
