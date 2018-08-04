<template>
    <div class="user-card">
        <div class="user-card-name">{{user.displayName}}</div>
        <img class="user-card-item-photo" :src="user.photo" v-if="user.photo"/>
        <div class="user-card-details">
            <div class="user-card-item-title">{{user.jobTitle}}</div>
            <div class="user-card-item-title">{{user.officeLocation}}</div>
            <div class="user-card-item-links">
                View in
                <a class="user-card-item-link" target="_blank" rel="noopener noreferrer" 
                   :href="user.delvelink">Delve</a>
                <a class="user-card-item-link" target="_blank" rel="noopener noreferrer" 
                   :href="user.aadlink">Azure</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'UserCard',

        computed: {
            user: {
                get() {
                    return this.$store.state.user.selectedSubject;
                }
            }
        }
    }
</script>
