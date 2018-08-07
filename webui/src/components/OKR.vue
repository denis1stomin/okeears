<template>
    <div class="okr">
        <div class="loading-objectives-waiter" v-if="currentlyLoading">
            <Spinner/>
        </div>

        <div class="okr-editor" v-else>
            <InputForm class="create-objective-form"
                       ref="newObjForm"
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
                <div class="objective-item-header">
                    <div class="objective-like-icon" @click="objective.like = !objective.like">
                        <StarIcon :class="{'objective-like-icon-selected': objective.like}"/>
                    </div>

                    <div class="objective-icons">
                        <span v-if="canChangeOkr" @click="deleteObjective(objective.id)"><TrashIcon/></span>
                        <span @click="copyObjective(objective)"><CopyIcon/></span>
                        <span v-if="!canChangeOkr" @click="sendChangeSuggestion(objective)"><SendIcon/></span>
                    </div>
                </div>

                <div class="objective-item-body">
                    <InputForm class="objective-title"
                               placeholder=""
                               :action="editObjective"
                               :value="objective.statement"
                               :obj="objective">
                    </InputForm>

                    <KeyResults :objective="objective"/>
                </div>
            </div>

            <div class="empty-objectives" v-if="!objectives.length">
                <div class="objectives" v-if="canChangeOkr">
                    <div class="objective-item-header">
                        <div class="objective-like-icon" @click="objective.like = !objective.like">
                            <StarIcon class="objective-like-icon-selected"/>
                        </div>

                        <div class="objective-icons">
                            <span v-if="canChangeOkr" @click="deleteObjective(objective.id)"><TrashIcon/></span>
                            <span @click="copyObjective(objective)"><CopyIcon/></span>
                            <span v-if="!canChangeOkr" @click="sendChangeSuggestion(objective)"><SendIcon/></span>
                        </div>
                    </div>

                    <div class="objective-item-body">
                        <InputForm class="objective-title"
                                   placeholder=""
                                   :value="landingObjective.statement" />

                        <KeyResults :objective="landingObjective"/>
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

    export default {
        name: 'Objectives',

        components: {TrashIcon, CopyIcon, SendIcon, StarIcon, PlusIcon, InputForm, ChangeLog, KeyResults, Spinner},

        computed: {
            objectives: {
                get() {
                    return this.$store.state.okr.objectives;
                }
            },

            currentlyLoading: {
                get() {
                    return this.$store.state.okr.loading;
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
            },

            landingObjective: {
                get() {
                    return {
                        statement: "Create a few ambitious objectives",
                        keyresults: [
                            { 
                                statement: "Create at least 3 objectives for the next iteration",
                                percent: 0
                            },
                            {
                                statement: "Achieve at minimum 60% of success rate",
                                percent: 0
                            }
                        ]
                    };
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

            editObjective(obj, objStatement) {
                this.$store.dispatch('EDIT_OBJECTIVE', {
                    objective: obj,
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
