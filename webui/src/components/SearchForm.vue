<template>
    <div class="input-form input-search">
        <input type="text"
               v-model="text"
               placeholder="Find people"
               @input="searchSubjects(text)"
               @blur="hideSearchedSubject"/>
        <div class="action-button" @click="searchSubjects(text)">
            <SearchIcon/>
        </div>

        <transition name="fade">
            <div class="suggested-subjects-list" v-show="searchedSubjectShoved">
                <div v-for="item in searchedSubjects"
                     class="suggested-subjects-item"
                     @click="selectInterestingSubject(item)">{{item.displayName}}
                </div>
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
                searchedSubjectShoved: false,
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

            searchedSubjects: {
                get() {
                    return this.$store.state.user.searchedSubjectsList;
                }
            }
        },

        methods: {
            showSearchedSubject(query) {
                console.log(query);
                if (query) {
                    this.searchedSubjectShoved = true;
                }
            },

            hideSearchedSubject() {
                this.searchedSubjectShoved = false;
            },

            searchSubjects(query) {
                this.$store.dispatch('SEARCH_SUBJECTS', query);
                this.searchedSubjectShoved = true;
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
        }
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>