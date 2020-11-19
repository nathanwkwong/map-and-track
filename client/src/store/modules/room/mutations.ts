import { MutationTree } from 'vuex';
import { RoomState } from './state';
import { JoinRoomRes } from '@/services/account/types'
import { User } from '@/types/account'
import * as types from '@/store/modules/room/mutation-types'
import { MapSpot, MapSpotBasic, MapTrace } from '@/types/room';
import { OthersIsTraceSelfModeOnRes } from '@/services/room/types';

const mutations: MutationTree<RoomState> = {
    [types.SET_SOCKET]: (state: RoomState, socket: SocketIOClient.Socket) => {
        state.socket = socket
    },
    [types.SET_SOCKET_QUERY]: (state: RoomState, query: any) => {
        if (state.socket) {
            state.socket.io.opts.query = query;
        }
    },
    [types.INIT_ROOM]: (state: RoomState) => {
        state.roomId = ''
        state.roomName = ''
        state.selfMapTraces = []
        state.users = []
        state.coordinates = [114.177216, 22.302711] // Hong Kong
        state.mapTraces = []
        state.mapSpots = []
        state.socket = null
        state.isShowMapSpot = false
        state.map = null
    },
    [types.SET_MAP]: (state: RoomState, map: google.maps.Map) => {
        state.map = map;
    },
    [types.JOIN_ROOM]: (state: RoomState, payload: JoinRoomRes) => {
        state.roomId = payload.roomId;
        state.roomName = payload.roomName;
        state.users = payload.users;
        state.mapTraces = payload.mapTraces;
        state.mapSpots = payload.mapSpots;
    },
    [types.ADD_USER]: (state: RoomState, user: User) => {
        state.users.push(user);
    },
    [types.REMOVE_USER]: (state: RoomState, userId: string) => {
        state.users = state.users.filter((user) => {
            return user.userId !== userId
        })
    },
    [types.ADD_MAP_TRACE]: (state: RoomState, mapTrace: MapTrace) => {

        if (state.mapTraces.length > 0 && state.map) {
            const { mapTraceId, userTraces } = mapTrace;

            const targetMapTraceIdx = state.mapTraces.findIndex(mapTrace => {
                return mapTrace.mapTraceId === mapTraceId;
            });

            const { coordinates } = userTraces[
                userTraces.length - 1
            ].geoLoc;

            if (targetMapTraceIdx === -1) {
                //case: mapTrace not exist
                const marker = new google.maps.Marker({
                    position: {
                        lat: coordinates[1],
                        lng: coordinates[0],
                    },
                    map: state.map,
                });
                const infoWindow = new google.maps.InfoWindow({
                    disableAutoPan: true,
                });
                state.mapTraces.push({ ...mapTrace, marker, infoWindow });
            } else {
                //case: mapTrace not exist
                state.mapTraces[targetMapTraceIdx].userTraces.push(userTraces[userTraces.length - 1]);
                state.mapTraces[targetMapTraceIdx].marker.setPosition(
                    new google.maps.LatLng(coordinates[1], coordinates[0])
                );
            }
        } else {
            state.mapTraces = [mapTrace];
        }
    },
    [types.ADD_MAP_SPOT]: (state: RoomState, mapSpot: MapSpot) => {
        if (state.mapSpots.length) {
            state.mapSpots.push(mapSpot)
        } else {
            state.mapSpots = [mapSpot]
        }
    },
    [types.SET_COORDINATES]: (state: RoomState, coordinates: number[]) => {
        state.coordinates = coordinates
    },
    [types.SET_USERS_IS_TRACE_SELF_MODE_ON]: (state: RoomState, { userId, isTraceSelfModeOn }: OthersIsTraceSelfModeOnRes) => {
        const targetUserIndex = state.users.findIndex(user => user.userId === userId);
        if(targetUserIndex !== -1){
            const targetUser = state.users[targetUserIndex];
            targetUser.isTraceSelfModeOn = isTraceSelfModeOn;
            state.users.splice(targetUserIndex, 1, targetUser);
        }
    },
    [types.EXIT_ROOM]: (state: RoomState) => {
        state.roomId = '';
        state.roomName = '';
        state.users = [];
        state.coordinates = [];
        state.mapTraces = [];
        state.mapSpots = [];
        state.socket = null;
    },

    [types.SET_IS_SHOW_MAP_LOG]: (state: RoomState, isShowMapSpot: boolean) => {
        state.isShowMapSpot = isShowMapSpot;

    },
    [types.UPDATE_SELF_MAP_TRACE]: (state: RoomState, mapSpot: MapSpotBasic) => {
        state.selfMapTraces.push(mapSpot);
    },

    [types.UPDATE_LAST_UPDATED_MAP_TRACE_ID]: (state: RoomState, lastUpdatedMapTraceId: string) => {
        state.lastUpdatedMapTraceId = lastUpdatedMapTraceId
    },
    [types.UPDATE_ALL_MAP_TRACES]: (state: RoomState, mapTraces: MapTrace[]) => {
        state.mapTraces = mapTraces;
    },
    [types.REMOVE_ALL_MAP_TRACES]: (state: RoomState) => {
        state.mapTraces.length = 0;
    },
    [types.SET_SELF_MAP_TRACE_ID](state: RoomState, selfMapTraceId: string) {
        state.selfMapTraceId = selfMapTraceId;
    }
}

export default mutations;