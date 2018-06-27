<template>
    <div class="change-log">
        <h4>Change log:</h4>
        <p v-for="record in logs">{{record}}</p>
    </div>
</template>

<script>
    export default {
        name: 'ChangeLog',

        computed: {
            logs: {
                get() {
                    return this.$store.state.audit.changes;
                }
            }
        },
    }
</script>
