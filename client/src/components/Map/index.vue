<template>
    <div class="map-wrapper">
        <section class="google-map" id="google-map" ref="google-map"></section>
    </div>
</template>

<script lang=ts>
import Vue from "vue";
import {} from "googlemaps";
import { createNamespacedHelpers, mapActions } from "vuex";
import { SelfMapTrace, MapSpot, MapTrace } from "../../types/room";
import { KEY } from "../../store/storage";

const accountNameSapceMappers = createNamespacedHelpers("account");
const mapGettersAccount = accountNameSapceMappers.mapGetters;

const roomNameSapceMappers = createNamespacedHelpers("room");
const mapGettersRoom = roomNameSapceMappers.mapGetters;
const mapActionsRoom = roomNameSapceMappers.mapActions;

export default Vue.extend({
    name: "google-map",
    data() {
        return {
            watchPositionId: -1,
            selfMarker: null as null | google.maps.Marker,
            markers: Array() as google.maps.Marker[],
            infoWindows: Array(),
        };
    },
    computed: {
        ...mapGettersAccount({
            isTraceSelfModeOn: "isTraceSelfModeOn",
            isTraceOthersModeOn: "isTraceOthersModeOn",
            isManualModeOn: "isManualModeOn",
        }),
        ...mapGettersRoom({
            roomId: "roomId",
            roomName: "roomName",
            map: "map",
            socket: "socket",
            selfMapTraceId: "selfMapTraceId",
            mapTraces: "mapTraces",
            mapSpots: "mapSpots",
            coordinates: "coordinates",
            lastUpdatedMapTraceId: "lastUpdatedMapTraceId",
        }),
    },
    mounted() {
        this.initMap();
        this.initCurrentPosition();
    },
    beforeUpdate() {},
    watch: {
        isTraceSelfModeOn(isTraceSelfModeOn) {
            if (this.isTraceSelfModeOn) {
                this.startSelfLocationUpdates();
            } else {
                this.stopSelfLocationUpdates();
            }
        },
        isTraceOthersModeOn(isTraceOthersModeOn) {
            console.log(74, "isTraceOthersModeOn", this.isTraceOthersModeOn);
            if (this.isTraceOthersModeOn) {
                this.startOthersLocationUpdates();
            } else {
                this.stopOthersLocationUpdates();
            }
        },

        mapTraces(mapTraces, prevMapTraces) {
            if (prevMapTraces.length === 0) {
                this.initOthersMapTraces();
            }
        },
        coordinates(coordinates, prevCoordinates) {
            this.setCenter(coordinates);
            this.setSelfMarker(coordinates);
        },
        // lastUpdatedMapTraceId(lastUpdatedMapTraceId) {
        //     this.updateOthersMapTrace(lastUpdatedMapTraceId);
        // },
    },
    beforeDestroy() {
        console.log("beforeDestroy");
    },
    methods: {
        ...mapActionsRoom({
            setMap: "setMap",
            startReceiveOthersMapTrace: "startReceiveOthersMapTrace",
            updateAllMapTraces: "updateAllMapTraces",
            setCoordinates: "setCoordinates",
            addMapTrace: "addMapTrace",
            setUsersIsTraceSelfModeOn: "setUsersIsTraceSelfModeOn",
        }),
        initMap() {
            const targetElement = this.$refs["google-map"] as Element;
            const map = new google.maps.Map(targetElement, {
                center: {
                    lat: this.coordinates[1],
                    lng: this.coordinates[0],
                },
                zoom: 15,
                maxZoom: 20,
                minZoom: 3,
                streetViewControl: false,
                mapTypeControl: false,
                // mapTypeId: google.map.mapTypeId.ROADMAP,
            });
            this.setMap(map);
        },
        initCurrentPosition() {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    const currCoordinates = [longitude, latitude];
                    this.initSelfMarker(currCoordinates);
                    this.setCoordinates(currCoordinates);
                },
                (error) => {
                    console.log(error.message);
                }
            );
        },
        initSelfMarker(coordinates: number[]) {
            this.selfMarker = new google.maps.Marker({
                position: {
                    lat: coordinates[1],
                    lng: coordinates[0],
                },
                map: this.map,
            });
        },
        initOthersMapTraces() {
            const mapTracesExtend: MapTrace[] = this.mapTraces;

            this.mapTraces.forEach((mapTrace: MapTrace, index: number) => {
                if (
                    mapTrace.isActive &&
                    mapTrace.mapTraceId !== this.selfMapTraceId
                ) {
                    const { coordinates } = mapTrace.userTraces[
                        mapTrace.userTraces.length - 1
                    ].geoLoc;
                    console.log(mapTrace);

                    if (mapTracesExtend[index].marker) {
                        mapTracesExtend[index].marker.setPosition(
                            new google.maps.LatLng(
                                coordinates[0],
                                coordinates[1]
                            )
                        );
                    } else {
                        mapTracesExtend[index].marker = new google.maps.Marker({
                            position: {
                                lat: coordinates[1],
                                lng: coordinates[0],
                            },
                            map: this.map,
                        });
                    }

                    mapTracesExtend[
                        index
                    ].infoWindow = new google.maps.InfoWindow({
                        disableAutoPan: true,
                        // content: `<div class="ui header">${mapTrace.user.username} </div>`
                    });
                }
            });
            console.log(209, "extended mapTraces", mapTracesExtend);
            this.updateAllMapTraces(mapTracesExtend);
        },
        startSelfLocationUpdates() {
            console.log(164, "startSelfLocationUpdates");
            if (!this.isManualModeOn) {
                this.watchPositionId = navigator.geolocation.watchPosition(
                    (position) => {
                        console.log(114, "watchPosition");
                        const { longitude, latitude } = position.coords;
                        const currCoordinates = [longitude, latitude];
                        this.setCoordinates(currCoordinates);
                        this.addMapTrace(currCoordinates);
                    },
                    (error) => {
                        console.log(error.message);
                    }
                );
            }else{
                this.addMapTrace(this.coordinates);
            }
        },
        setSelfMarker(coordinates: number[]) {
            // @ts-ignore
            this.selfMarker.setPosition(
                new google.maps.LatLng(coordinates[1], coordinates[0])
            );
        },
        setCenter(coordinates: number[]) {
            this.map.setCenter(
                new google.maps.LatLng(coordinates[1], coordinates[0])
            );
        },
        stopSelfLocationUpdates() {
            console.log(134, "stopSelfLocationUpdates");
            navigator.geolocation.clearWatch(this.watchPositionId);
            this.socket.emit("stopMapTrace", {
                mapTraceId: this.selfMapTraceId,
            });
        },
        startOthersLocationUpdates() {
            this.socket.emit("updateAllMapTraces", {});
            this.startReceiveOthersMapTrace();
        },
        stopOthersLocationUpdates() {
            //TODO
        },
    },
});
</script>

<style scoped>
.google-map {
    width: 100%;
    height: 400px;
}
</style>
