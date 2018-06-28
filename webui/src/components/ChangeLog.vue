<template>
    <div class="change-log">
        <h4 class="change-log-header">Change log:</h4>
        <div class="change-log-elements">
            <span v-for="record in logs" class="change-log-element">{{record}}</span>
        </div>
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
