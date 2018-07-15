<template>
    <div class="key-results" :objective="objective">
        <div class="key-result" v-if="objective.keyresults.length"
             v-for="keyresult in objective.keyresults">
            <span>{{keyresult.statement}}</span>
        </div>

        <div class="empty-key-results" v-if="!objective.keyresults">
            Key result I want to achieve
        </div>
    </div>
</template>

<script>
    export default {
        name: 'KeyResult',

        props: ['objective']
    }
</script>
