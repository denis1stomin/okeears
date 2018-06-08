<template>
    <div class="org-tree">
        <span class="org-tree-item" v-for="user in orgtree">{{user.name}}</span>
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
