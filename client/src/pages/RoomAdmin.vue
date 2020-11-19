<template>
    <div>
        <div v-if="!roomId">please select a room in lobby first.</div>
        <div class="room-main" v-else>
            <ListUser />
            <div class="room-map-wrapper">
                <Map class="room-map"></Map>
                <section class="list-map-spot-wrapper" v-if="isShowMapSpot">
                    <ListMapSpot />
                </section>
                <section class="list-menu-wrapper"><ListMenu /></section>
            </div>
            <div class="manual-control">
                <button @click="setIsManualModeOn(!isManualModeOn)">
                    switch manual mode
                </button>
                <button
                    @click="goToXY([-dX, 0])"
                    :disabled="!isManualModeOn"
                >
                    left
                </button>
                <button
                    @click="goToXY([dX, 0])"
                    :disabled="!isManualModeOn"
                >
                    right
                </button>
                <button
                    @click="goToXY([0, -dY])"
                    :disabled="!isManualModeOn"
                >
                    up
                </button>
                <button
                    @click="goToXY([0, dY])"
                    :disabled="!isManualModeOn"
                >
                    down
                </button>
            </div>
            <section class="room-info-wrapper">
                room name: {{ roomName }} <br />
                current coordinates: {{ coordinates }}<br />
                trace self: {{ this.isTraceSelfModeOn }}<br />
                trace others: {{ this.isTraceOthersModeOn }}<br />
                manual mode: {{ this.isManualModeOn }}
            </section>
            <div v-if="mapTraces[0]">
                maptrace:
                <div
                    v-for="userTrace in mapTraces[0].userTraces"
                    :key="userTrace.mapTraceId"
                >
                    {{ userTrace.geoLoc.coordinates[0] }},
                    {{ userTrace.geoLoc.coordinates[1] }}
                </div>
            </div>
            <div v-if="selfMapTraces">
                my maptrace:
                <div v-for="mapSpot in selfMapTraces" :key="mapSpot.mapTraceId">
                    {{ mapSpot.geoLoc.coordinates[0] }},
                    {{ mapSpot.geoLoc.coordinates[1] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import Map from "@/components/Map/index.vue";
import ListMapSpot from "@/components/ListMapSpot/index.vue";
import ListMenu from "@/components/ListMenu/index.vue";
import ListUser from "@/components/ListUser/index.vue";
import io from "socket.io-client";

const accountNameSapceMappers = createNamespacedHelpers("account");
const mapGettersAccount = accountNameSapceMappers.mapGetters;
const mapActionsAccount = accountNameSapceMappers.mapActions;

const roomNameSapceMappers = createNamespacedHelpers("room");
const mapGettersRoom = roomNameSapceMappers.mapGetters;
const mapActionsRoom = roomNameSapceMappers.mapActions;

export default Vue.extend({
    data() {
        return {
            roomId: this.$route.params.roomId,
            isGoogleMapOnTop: false,
            dX: 0.01,
            dY: 0.01
        };
    },
    computed: {
        ...mapGettersRoom({
            roomName: "roomName",
            coordinates: "coordinates",
            socket: "socket",
            mapTraces: "mapTraces",
            selfMapTraces: "selfMapTraces",
            isShowMapSpot: "isShowMapSpot",
        }),
        ...mapGettersAccount({
            isTraceSelfModeOn: "isTraceSelfModeOn",
            isTraceOthersModeOn: "isTraceOthersModeOn",
            isManualModeOn: "isManualModeOn",
            userId: "userId",
        }),
    },
    mounted() {},
    beforeDestroy() {
        this.exitRoom();
    },
    methods: {
        ...mapActionsAccount({
            setIsTraceSelfModeOn: "setIsTraceSelfModeOn",
            setIsTraceOthersModeOn: "setIsTraceOthersModeOn",
            setIsManualModeOn: "setIsManualModeOn",
        }),
        ...mapActionsRoom({
            exitRoom: "exitRoom",
            goToXY: "goToXY",
        }),
    },
    components: {
        ListMapSpot,
        ListMenu,
        ListUser,
        Map,
    },
});
</script>

<style lang="scss">
.room-main {
    /* position: relative; */
    height: 500px;

    .list-user-wrapper {
        display: flex;
        justify-content: space-between;
        height: 80px;
        border: 2px solid;
    }

    .list-map-spot-wrapper {
        position: absolute;
        z-index: 3;
        left: 10%;
        top: 5%;
        background: #ffffff;
        width: 80%;
        height: 80%;
    }

    .room-map-wrapper {
        position: relative;
        width: 100%;
        height: 450px;

        .menu-wrapper {
            background-color: #ffffff;
            opacity: 0.6;
        }

        .list-menu-wrapper {
            position: absolute;
            z-index: 1;
        }

        .room-map {
            position: absolute;
            /* z-index: -1; */
            width: 100%;
        }
    }
    .room-info-wrapper {
        border: 2px solid;
        bottom: 0;
    }
}
</style>
