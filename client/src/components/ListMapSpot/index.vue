<template>
    <div class="list-map-spot-wrapper">
        <MapSpot
            v-for="mapSpot in mapSpots"
            :key="mapSpot.mapSpotId"
            :mapSpot="mapSpot"
        />
    </div>
</template>

<script>
import Vue from "vue";
import { createNamespacedHelpers } from "vuex";
import MapSpot from "@/components/MapSpot/index.vue";
const roomNameSapceMappers = createNamespacedHelpers("room");
const mapGettersRoom = roomNameSapceMappers.mapGetters;

export default Vue.extend({
    computed: {
        ...mapGettersRoom({
            mapSpots: "mapSpots",
        }),
    },
    components: {
        MapSpot,
    },
});
</script>

<style lang="scss" scoped>
.list-map-spot-wrapper {
    overflow-y: scroll;
}
</style>