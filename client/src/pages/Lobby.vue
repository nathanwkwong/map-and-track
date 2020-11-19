<template>
    <div class="page-lobby-wrapper">
        <div class="project-logo"></div>
        <Input
            type="text"
            class="new-room"
            placeholder="new room name"
            v-model="newRoomName"
        />
        <Button class="btn-create" @click="onClickCreateRoom">Create</Button>
        <Input
            type="text"
            class="room-id"
            v-model="roomId"
            placeholder="room id to join"
        />
        <Button class="btn-join" @click="joinRoom">joinaaaa</Button>
        <div>
            <div class="created-room-list">
                Created Room List
                <div
                    class="created-room"
                    v-for="room in createdRooms"
                    :key="room.roomId"
                    @click="onSelectRoom(room)"
                >
                    {{ room.roomName }}
                </div>
            </div>
            <div class="joined-room-list">
                Joined Room List
                <div
                    class="joined-room"
                    v-for="room in joinedRooms"
                    :key="room.roomId"
                    @click="onSelectRoom(room)"
                >
                    {{ room.roomName }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters, createNamespacedHelpers } from "vuex";
import Button from "@/components/Button/Button.vue";
import Input from "@/components/Input/Input.vue";
import { RoomInfo } from "../types/room";

const accountNameSapceMappers = createNamespacedHelpers("account");
const mapGettersAccount = accountNameSapceMappers.mapGetters;
const roomNameSapceMappers = createNamespacedHelpers("room");
const mapActionsRoom = roomNameSapceMappers.mapActions;

//assume all user login after
export default Vue.extend({
    name: "Lobby",
    data() {
        return {
            newRoomName: "",
            roomId: "",
            roomName: "",
        };
    },
    computed: {
        ...mapGettersAccount({
            joinedRooms: "joinedRooms",
            createdRooms: "createdRooms",
            userId: "userId",
        }),
    },
    methods: {
        ...mapActionsRoom({
            connectRoomSocket: "connectRoomSocket",
            createRoom: "createRoom",
            initRoom: "initRoom"
        }),
        async onClickCreateRoom() {
            const payload = {
                roomName: this.newRoomName,
            };
            this.createRoom(payload);
        },
        async joinRoom() {
            const payload = {
                roomId: this.roomId,
                userId: this.userId,
            };
            this.initRoom();
            this.connectRoomSocket(payload);
        },
        onSelectRoom(room: RoomInfo) {
            const { roomId, roomName } = room;
            this.roomName = roomName;
            this.roomId = roomId;
        },
    },

    created() {},
    components: {
        Input,
        Button,
    },
});
</script>


<style lang="scss">
.page-lobby-wrapper {
    margin-top: 5px;
}
</style>