<template>
    <div class="org-tree">
        <div class="org-tree-item" v-for="user in orgtree">
            <span class="org-tree-item-name">{{user.name}}</span>
            <span class="org-tree-item-title">{{user.jobTitle}}</span>
            <span class="org-tree-item-links">
                View in
                <a class="org-tree-item-link" target="_blank" :href="user.delvelink">Delve</a>
                <a class="org-tree-item-link" target="_blank" :href="user.o365link">O365</a>
                <a class="org-tree-item-link" target="_blank" :href="user.aadlink">Portal</a>
            </span>
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
            }
        }
    }
</script>
