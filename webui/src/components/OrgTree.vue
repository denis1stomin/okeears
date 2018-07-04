<template>
    <div class="org-tree">
        <div class="org-tree-item" :class="{'org-tree-item-selected': user.id === selectedSubject.id}"
             v-for="user in orgtree" @click="showInterestingOKR(user)">
            <div class="org-tree-item-header org-tree-item-name">{{user.name}}</div>
            <div class="org-tree-item-body">
                <span class="org-tree-item-title">{{user.jobTitle}}</span>
                <span class="org-tree-item-links">
                    View in
                    <a class="org-tree-item-link" target="_blank" :href="user.delvelink">Delve</a>
                    <a class="org-tree-item-link" target="_blank" :href="user.o365link">O365</a>
                    <a class="org-tree-item-link" target="_blank" :href="user.aadlink">Portal</a>
                </span>
            </div>
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
            showInterestingOKR(user) {
                this.$store.dispatch('SET_SELECTED_SUBJECT', user);
            }
        }
    }
</script>
