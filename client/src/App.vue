<template>
    <div id="app">
        <div v-if="isShowLoginPage">
            <app-login />
        </div>
        <div class="main-view" v-else>
            <header class="menu-top">
                <div class="menu-top-left" id="nav">
                    <router-link to="/lobby">Lobby</router-link>
                    <router-link :to="'/room/' + roomId">Room</router-link>
                </div>
                <div class="menu-top-right">
                    <div v-if="username">hi, {{ username }}</div>
                    <button class="btn-logout" @click="logout">logout</button>
                </div>
            </header>
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers, mapState } from "vuex";
import Login from "@/pages/Login.vue";
const accountNameSapceMappers = createNamespacedHelpers("account");
const mapGettersAccount = accountNameSapceMappers.mapGetters;
const mapActionsAccount = accountNameSapceMappers.mapActions;

const roomNameSapceMappers = createNamespacedHelpers("room");
const mapGettersRoom = roomNameSapceMappers.mapGetters;
const mapActionsRoom = roomNameSapceMappers.mapActions;

export default Vue.extend({
    name: "App",

    computed: {
        ...mapGettersAccount({
            username: "username",
            isLoggedIn: "isLoggedIn",
            isRestoringLogin: "isRestoringLogin",
        }),
        ...mapGettersRoom({
            roomId: "roomId",
        }),
        isShowLoginPage() {
            return this.isRestoringLogin || !this.isLoggedIn;
        },
    },
    async beforeCreate() {
        await this.$store.dispatch(`account/restoreLogin`);
    },
    methods: {
        ...mapActionsRoom({
            restorLogin: "restoreLogin",
        }),
        ...mapActionsAccount({
            logout: "logout",
        }),
    },

    components: {
        "app-login": Login,
    },
});
</script>

<style lang="scss" scoped>
.main-view {
    .menu-top {
        display: flex;
        justify-content: space-between;

        .menu-top-right {
            display: flex;
        }
    }
}
</style>
