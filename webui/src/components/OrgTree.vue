<template>
    <div class="org-tree">
        <div class="org-tree-item" :class="{'org-tree-item-selected': user.id === selectedSubject.id}"
             v-for="user in orgtree" @click="selectSubject(user)">
            <img class="org-tree-item-photo" :src="user.photo" v-if="user.photo"/>
            <span class="org-tree-item-name">{{user.displayName}}</span>
            <span class="org-tree-item-job">{{user.jobTitle}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'OrgTree',

        computed: {
            orgtree: {
                get() {
                    return this.$store.state.user.orgtree;
                }
            },

            selectedSubject: {
                get() {
                    return this.$store.state.user.selectedSubject;
                }
            }
        },

        methods: {
            selectSubject(user) {
                this.$store.dispatch('SET_SELECTED_SUBJECT', user);
            }
        }
    }
</script>
