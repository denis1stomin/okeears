<template>
    <div class="okr">
        <h3 class="title">OKR Editor</h3>

        <InputForm placeholder="Let's create new Object">
            <span class="input-plus">+</span>
        </InputForm>

        <div class="objectives" v-for="objective in objectives">
            <span class="objective">{{objective.statement}}</span>
            <div class="key-results" v-for="keyresult in objective.keyresults">
                <span class="key-result">{{keyresult.statement}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import InputForm from './InputForm'

    export default {
        name: 'OKR',

        components: {InputForm},

        computed: {
            objectives: {
                get() {
                    return this.$store.state.user.objectives;
                }
            }
        }
    }
</script>
