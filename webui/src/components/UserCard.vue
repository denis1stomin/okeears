<template>
    <div>
        <h4 class="user-card-name">{{user.givenName + ' ' + user.surname}}</h4>
        <div class="user-card-img">
            <div class="user-card-photo" v-if="user.photo" :style="{backgroundImage: `url('${user.photo}')`}"></div>
            <UserIcon class="user-card-no-photo" v-if="!user.photo"/>
        </div>
        <div class="user-card-details">
            <div class="user-card-item-title">{{user.jobTitle}}</div>
            <div class="user-card-item-title">{{user.officeLocation}}</div>
            <div class="user-card-item-title">{{user.userPrincipalName}}</div>
            <div class="user-card-item-links">
                View in
                <a class="user-card-item-link" target="_blank" rel="noopener noreferrer"
                   :href="user.delvelink">Delve</a>
            </div>
        </div>
    </div>
</template>

<script>
    import UserIcon from './Icons/UserIcon';

    export default {
        name: 'UserCard',

        components: {UserIcon},

        computed: {
            user: {
                get() {
                    return this.$store.state.user.selectedSubject;
                }
            }
        }
    }
</script>
