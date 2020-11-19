import { IRootState } from '@/store';
import { GetterTree } from 'vuex';
import { RoomState } from './state';

const getters: GetterTree<RoomState, IRootState> = {
    roomId: (state: RoomState) => {
        return state.roomId;
    },
    roomName: (state: RoomState) => {
        return state.roomName;
    },
    map: (state: RoomState) => {
        return state.map;
    },
    users: (state: RoomState) => {
        return state.users;
    },
    mapTraces: (state: RoomState) => {
        return state.mapTraces;
    },
    selfMapTraces: (state: RoomState) =>{
        return state.selfMapTraces;
    },
    mapSpots: (state: RoomState) => {
        return state.mapSpots;
    },
    coordinates: (state: RoomState) => {
        return state.coordinates;
    },
    socket: (state: RoomState) => {
        return state.socket;
    },
    isShowMapSpot: (state: RoomState) => {
        return state.isShowMapSpot
    },
    selfMapTraceId: (state: RoomState) => {
        return state.selfMapTraceId
    },
}


export default getters;