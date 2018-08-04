<template>
    <div class="input-form input-search">
        <input type="text"
               v-model="text"
               placeholder="Find people"
               @focus="showSuggestedSubject"
               @blur="hideSuggestedSubject"/>
        <div class="action-button">
            <SearchIcon/>
        </div>

        <transition name="fade">
            <div class="suggested-subjects-list" v-show="suggestedSubjectsAreVisible">
                <div v-for="item in suggestedSubjects"
                     class="suggested-subjects-item"
                     @click="selectInterestingSubject(item)">{{item.displayName}}</div>
                <div class="suggested-subjects-no-items" v-if="!suggestedSubjects.length">No matches</div>
            </div>
        </transition>
    </div>
</template>

<script>
    import SearchIcon from './../components/Icons/SearchIcon'

    export default {
        name: "SearchForm",

        components: {SearchIcon},

        data() {
            return {
                suggestedSubjectsAreVisible: false,
            }
        },

        computed: {
            text: {
                get() {
                    return this.$store.state.user.searchQuery;
                },

                set(changed) {
                    // TODO : we do not change state.user.searchQuery here?
                    this.$store.dispatch('SEARCH_SUBJECTS', changed);
                }
            },

            suggestedSubjects: {
                get() {
                    return this.$store.state.user.suggestedSubjectsList;
                }
            }
        },

        methods: {
            showSuggestedSubject() {
                this.suggestedSubjectsAreVisible = true;
            },

            hideSuggestedSubject() {
                this.suggestedSubjectsAreVisible = false;
            },

            selectInterestingSubject(item) {
                this.$store.dispatch('SET_INTERESTING_SUBJECT', item);
                // TODO : do not need this extra request when selecting a subject
                this.$store.dispatch('SEARCH_SUBJECTS', '');
            }
        }
    }
</script>

<style scoped lang="less">
    .input-search {
        position: relative;
        margin: 30px;

        .action-button {
            &:hover {
                color: #ccc;
                fill: #ccc;
                stroke: #ccc;
                cursor: default;
            }
        }

        .suggested-subjects-list {
            position: absolute;
            top: 35px;
            right: 0;
            left: 0;
            z-index: 1;

            .suggested-subjects-no-items {
                font-size: 14px;
                color: #727272;
                font-style: italic;
            }
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>