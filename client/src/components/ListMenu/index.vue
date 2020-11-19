<template>
    <div class="menu-wrapper">
        <div class="menu-item menu-collaspe" @click="toggleMenu">
            <img class="img-menu left-menu" :src="menu" alt="" />
            menu
        </div>
        <div class="menu-list" v-if="!isCollapsed">
            <div
                class="menu-item trace-self"
                @click="setIsTraceSelfModeOn(!isTraceSelfModeOn)"
            >
                <img class="img-menu img-trace-self" :src="traceSelf" alt="" />
                trace self
            </div>
            <div
                class="menu-item trace-others"
                @click="setIsTraceOthersModeOn(!isTraceOthersModeOn)"
            >
                <img
                    class="img-menu img-trace-self"
                    :src="traceOthers"
                    alt=""
                />
                trace others
            </div>
            <div class="menu-item add-spot" @click="addMapSpot">
                <img class="img-menu img-add-spot" :src="add" alt="" />
                add spot
            </div>
            <div
                class="menu-item map-log"
                @click="setIsShowMapSpot(!isShowMapSpot)"
            >
                <img class="img-menu img-map-log" :src="mapLog" alt="" />
                map log
            </div>
            <div class="menu-item remove" @click="removeTrace">
                <img class="img-menu img-remove" :src="remove" alt="" />
                remove trace
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import User from "../User/index.vue";

const roomNameSapceMappers = createNamespacedHelpers("room");
const mapGettersRoom = roomNameSapceMappers.mapGetters;
const mapActionsRoom = roomNameSapceMappers.mapActions;

const accountNameSapceMappers = createNamespacedHelpers("account");
const mapActionsAccount = accountNameSapceMappers.mapActions;
const mapGettersAccount = accountNameSapceMappers.mapGetters;

export default Vue.extend({
    data() {
        return {
            isCollapsed: true,
            menu: require("@/assets/leftMenu/menu.svg"),
            add: require("@/assets/leftMenu/add.svg"),
            remove: require("@/assets/leftMenu/remove.svg"),
            mapLog: require("@/assets/leftMenu/map-log.svg"),
            traceSelf: require("@/assets/leftMenu/trace-self.svg"),
            traceOthers: require("@/assets/leftMenu/trace-others.svg"),
        };
    },
    computed: {
        ...mapGettersRoom({
            users: "users",
            coordinates: "coordinates",
            socket: "socket",
            isShowMapSpot: "isShowMapSpot",
        }),
        ...mapGettersAccount({
            isTraceSelfModeOn: "isTraceSelfModeOn",
            isTraceOthersModeOn: "isTraceOthersModeOn",
            userId: "userId",
        }),
    },
    methods: {
        ...mapActionsAccount({
            setIsTraceSelfModeOn: "setIsTraceSelfModeOn",
            setIsTraceOthersModeOn: "setIsTraceOthersModeOn",
        }),
        ...mapActionsRoom({
            setIsShowMapSpot: "setIsShowMapSpot",
        }),

        toggleMenu() {
            this.isCollapsed = !this.isCollapsed;
        },
        addMapSpot() {
            this.socket.emit("addMapSpot", {
                coordinates: this.coordinates,
                createdAt: new Date(),
            });
        },
        removeTrace() {
            //TODO
        },
    },
    components: {
        User,
    },
});
</script>

<style lang="scss" scoped>
.menu-wrapper {
    .menu-list {
        display: flex;
        flex-direction: column;
    }

    .menu-item {
        display: flex;
        flex-direction: column;
    }
    .img-menu {
        width: 30px;
        height: 50px;
    }
}
</style>
