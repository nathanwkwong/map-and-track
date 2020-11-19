<template>
    <div class="map-spot-wrapper">
        <div class="map-spot-info">
            <User :user="user" />
            <div class="map-spot-coordinates">
                <div class="map-spot-long">
                    long: {{ parseFloat(this.coordinates[0]).toFixed(2) }}
                </div>
                <div class="map-spot-lat">
                    lat: {{ parseFloat(this.coordinates[1]).toFixed(2) }}
                </div>
            </div>
        </div>

        <div class="spot-checkout-wrapper" @click="goToSpot(coordinates)">
            <img class="img-explore" :src="explore" alt="" />
            checkout
        </div>
    </div>
</template>

<script lang=ts>
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import User from "../User/index.vue";
import { MapSpot } from "../../types/room";

const roomNameSapceMappers = createNamespacedHelpers("room");
const mapActionsRoom = roomNameSapceMappers.mapActions;

export default Vue.extend({
    name: "MapSpot",
    props: {
        mapSpot: {
            type: Object,
        },
    },
    data() {
        return {
            explore: require("@/assets/listMaplog/explore.svg"),
        };
    },
    created(){
    },
    computed: {
        coordinates() {
            return this.mapSpot.geoLoc.coordinates;
        },
        user() {
            return this.mapSpot.user;
        },
    },
    methods:{
        ...mapActionsRoom({
            goToSpot: "goToSpot"
        })
    },
    components: {
        User,
    },
});
</script>

<style lang="scss" scoped>
.map-spot-wrapper {
    display: flex;
    justify-content: space-between;

    .map-spot-info{
        display:flex;
    }
    .spot-checkout-wrapper {
        display: flex;
        flex-direction: column;
        font-size: 10px;
        .img-explore {
            width: 20px;
            height: 20px;
        }
    }
}
</style>