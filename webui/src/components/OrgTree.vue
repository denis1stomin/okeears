<template>
    <div class="org-tree">
        <span class="org-tree-item" v-for="user in orgtree">
            {{user.name}}
            <div class="org-tree-item-links">
                View on
                <a target="_blank" :href="user.aadlink">Portal</a>
                <a target="_blank" :href="user.o365link">O365</a>
                <a target="_blank" :href="user.delvelink">Delve</a>
            </div>
        </span>
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
