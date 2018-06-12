<template>
    <div class="okr">
        <h3 class="title">OKR Editor</h3>

        <div class="objectives" v-for="objective in objectives">
            <span class="objective">{{objective.statement}}</span>
            <div class="key-results" v-for="keyresult in objective.keyresults">
                <span class="key-result">{{keyresult.statement}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'OKR',

        computed: {
            objectives: {
                get() {
                    return this.$store.state.user.objectives;
                }
            }
        }
    }
</script>
