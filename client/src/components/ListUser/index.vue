<template>
    <div class="list-user-wrapper">
        <div class="list-user">
            <div v-for="user in users" :key="user.userId" >
            <User :user="user"/>
               {{!!user.isTraceSelfModeOn}}
            </div>
        </div>
        <img class="img-share" :src="share" alt="" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import User from "../User/index.vue";

const roomNameSapceMappers = createNamespacedHelpers("room");
const mapGettersRoom = roomNameSapceMappers.mapGetters;

export default Vue.extend({
    data() {
        return {
            share: require("@/assets/listUser/share.svg"),
        };
    },
    computed: {
        ...mapGettersRoom({
            users: "users",
        }),
    },
    components: {
        User,
    },
});
</script>

<style>

.list-user {
    display: flex;
    justify-content: space-between;
}
</style>
