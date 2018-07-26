<template>
    <div class="input-form input-search">
        <input type="text"
               v-model="text"
               placeholder="Find people"
               @input="searchSubjects(text)"
               @focus="showSuggestedSubject"
               @blur="hideSuggestedSubject"/>
        <div class="action-button" @click="searchSubjects(text)">
            <SearchIcon/>
        </div>

        <transition name="fade">
            <div class="suggested-subjects-list" v-show="suggestedSubjectShoved">
                <div v-for="item in suggestedSubjects"
                     class="suggested-subjects-item"
                     @click="selectInterestingSubject(item)">{{item.displayName}}</div>
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
                suggestedSubjectShoved: false,
            }
        },

        computed: {
            text: {
                get() {
                    return this.$store.state.user.searchValue;
                },

                set(changed) {
                    this.$store.commit('CHANGE_SEARCH_VALUE', changed);
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
                this.suggestedSubjectShoved = true;
            },

            hideSuggestedSubject() {
                this.suggestedSubjectShoved = false;
            },

            searchSubjects(query) {
                if (query.length) {
                    this.$store.dispatch('SEARCH_SUBJECTS', query);
                } else {
                    this.$store.dispatch('GET_RELEVANT_SUBJECTS')
                }
            },

            selectInterestingSubject(item) {
                this.$store.commit('CLEAN_SEARCH_VALUE');
                this.$store.dispatch('SET_INTERESTING_SUBJECT', item);
            }
        }
    }
</script>

<style scoped lang="less">
    .input-search {
        position: relative;

        .suggested-subjects-list {
            position: absolute;
            top: 35px;
            right: 0;
            left: 0;
            z-index: 1;
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>