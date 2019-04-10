<template>
    <div class="org-tree">
        <div class="org-tree-item" :class="{'org-tree-item-selected': user.id === selectedSubject.id}"
             v-for="user in orgtree" :key="user.id" @click="selectSubject(user)">
            <div class="user-card-img">
                <div class="user-card-photo" v-if="user.photo" :style="{backgroundImage: `url('${user.photo}')`}"></div>
                <UserIcon class="user-card-no-photo" v-if="!user.photo"/>
            </div>
            <div class="orgtree-item-info">
                <div class="org-tree-item-name">{{user.displayName}}</div>
                <div class="org-tree-item-job">{{user.jobTitle}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import UserIcon from './Icons/UserIcon.vue'
    
    import { mapState } from 'vuex'

    export default {
        name: 'OrgTree',

        components: {UserIcon},

        computed: {
            ...mapState({
               orgtree: state => state.user.orgtree,
               selectedSubject: state => state.user.selectedSubject
            })
        },

        methods: {
            selectSubject(user) {
                this.$store.dispatch('SET_SELECTED_SUBJECT', user);
            }
        }
    }
</script>
