<template>
    <div class="org-tree">
        <span class="org-tree-item">Idioma</span>
        <span class="org-tree-item">OKR</span>
        <span class="org-tree-item">Core</span>
        <span class="org-tree-item">{{userName}}</span>
    </div>
</template>

<script>
    export default {
        name: 'OrgTree',

        computed: {
            userName: {
                get() {
                    return this.$store.state.user.orgtree.name;
                }
            }
        }
    }
</script>
