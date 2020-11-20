import { ActionContext, ActionTree, MutationTree } from 'vuex'
import { IRootState } from "@/store/index";
import * as types from '@/store/modules/room/mutation-types';
import io from 'socket.io-client';
import API from '@/services/call';
import { RoomState } from './state';
import { MapTrace, WsRes } from '@/types/room';
import { KEY } from '@/store/storage';
import Vue from 'vue';
import { navigateToRoom } from '@/router/neviagtion';
import { OthersIsTraceSelfModeOnRes } from '@/services/room/types';

type RoomContext = ActionContext<RoomState, IRootState>

const actions: ActionTree<RoomState, IRootState> = {
    initRoom: async ({ rootState, commit, dispatch }: RoomContext, payload) => {
        commit(types.INIT_ROOM);
    },
    createRoom: async ({ rootState, commit, dispatch }: RoomContext, payload) => {
        const res = await API.room.createRoom(payload);
        if (res && res.data.success) {
            dispatch(`account/getCreatedRooms`, null, { root: true })
        }
    },
    setMap: ({ rootState, commit }: RoomContext, payload) => {
        commit(types.SET_MAP, payload)
    },
    setCoordinates: ({ rootState, commit }: RoomContext, payload) => {
        commit(types.SET_COORDINATES, payload)
    },
    goToXY({ rootState, state, commit, dispatch }: RoomContext, dXY: number[]) {
        const payload = [state.coordinates[0] + dXY[0], state.coordinates[1] - dXY[1]];
        if(rootState.account.isTraceOthersModeOn){
            dispatch('addMapTrace', payload);
        }
        commit(types.SET_COORDINATES, payload);
    },
    goToSpot({ state, commit }: RoomContext, payload) {
        commit(types.SET_COORDINATES, payload);
    },
    addMapTrace({ rootState, state, commit }: RoomContext, coordinates: number[]) {
        const createdAt = new Date();
        state.socket?.emit("addMapTrace", {
            mapTraceId: rootState.room.selfMapTraceId,
            coordinates,
            createdAt,
        });
    },
    connectRoomSocket: async ({ state, commit, rootState, dispatch }: RoomContext, payload) => {
        const { roomId, userId } = payload;

        let socketOptions = {
            query: {
                token: window.localStorage.getItem(KEY.ACCESS_TOKEN),
                roomId,
                userId,
                selfMapTraceId: null
            },
            reconnection: true,
            transports: ['polling','websocket']
        };

        const res = await API.room.renewSelfMapTraceId(userId);

        if (res && res.data.success) {
            const { selfMapTraceId } = res.data.data;
            console.log(selfMapTraceId);
            commit(types.SET_SELF_MAP_TRACE_ID, selfMapTraceId)
            socketOptions.query.selfMapTraceId = selfMapTraceId;
        }

        const socket: SocketIOClient.Socket = io(`http://localhost:3050`, socketOptions);

        socket.on("connect", (res: WsRes) => {
            console.log("socket connected to BN");
            commit(types.SET_SOCKET, socket);
            socket.emit("joinRoom", {})
        });

        socket.on("joinRoom", (res: WsRes) => {
            console.log('joinRoom', res);
            if (!res.code) {
                const { roomDetail } = res.data;
                commit(types.JOIN_ROOM, roomDetail);
                roomDetail.mapTraces.forEach((mapTrace: MapTrace) => {
                    if (mapTrace.isActive) {
                        console.log(mapTrace.isActive);
                        commit(types.SET_USERS_IS_TRACE_SELF_MODE_ON, {
                            userId: mapTrace.user.userId,
                            isTraceSelfModeOn: mapTrace.isActive
                        })
                    }
                })

                navigateToRoom(roomDetail.roomId);
            } else {
                Vue.prototype.$message.error(res.msg);
            }
        });

        socket.on("addUser", (res: WsRes) => {
            console.log('addUser', res);
            if (!res.code) {
                const newUser = res.data.user;
                const isUserInRoom = state.users.find(user =>
                    user.userId === newUser.userId
                )
                if (!isUserInRoom) {
                    commit(types.ADD_USER, newUser)
                }
            } else {
                Vue.prototype.$message.error(res.msg);
            }
        });

        socket.on("removeUser", (res: WsRes) => {
            console.log('removeUser', res);
            if (!res.code) {
                const { userId } = res.data;
                commit(types.REMOVE_USER, userId)
            } else {
                Vue.prototype.$message.error(res.msg);
            }
        });

        socket.on("addMapSpot", (res: WsRes) => {
            console.log('addMapSpot', res);
            if (!res.code) {
                commit(types.ADD_MAP_SPOT, res.data.mapSpot);
            } else {
                Vue.prototype.$message.error(res.msg);
            }
        });

        socket.on('updateSelfMapTrace', (res: WsRes) => {
            console.log('updateSelfMapTrace', res);
            console.log(res.data.mapSpot);
            if (!res.code) {
                commit(types.UPDATE_SELF_MAP_TRACE, res.data.mapSpot);
            } else {
                Vue.prototype.$message.error(res.msg);
            }
        })

        socket.on("updateAllMapTraces", (res: WsRes) => {
            dispatch('clearAllMapTraces')
            console.log('updateAllMapTraces', res);
            if (!res.code) {
                dispatch('updateAllMapTraces', res.data.mapTraces);
            } else {
                Vue.prototype.$message.error(res.msg);
            }
        })

        socket.on("updateUsersIsTraceSelfModeOn", (res: WsRes) => {
            console.log('updateUsersIsTraceSelfModeOn', res);
            if (!res.code) {
                dispatch('setUsersIsTraceSelfModeOn', res.data);
            } else {
                Vue.prototype.$message.error(res.msg);
            }
        })
    },
    setUsersIsTraceSelfModeOn: async ({ state, commit, rootState }: RoomContext, payload: OthersIsTraceSelfModeOnRes) => {
        commit(types.SET_USERS_IS_TRACE_SELF_MODE_ON, payload);
    },
    startReceiveOthersMapTrace: async ({ state, commit, rootState }: RoomContext) => {
        state.socket?.on("addMapTrace", (res: WsRes) => {
            console.log('addMapTrace', res);
            if (!res.code) {
                const { mapTrace } = res.data;
                commit(types.UPDATE_LAST_UPDATED_MAP_TRACE_ID, mapTrace.mapTraceId)
                commit(types.ADD_MAP_TRACE, mapTrace);
            } else {
                Vue.prototype.$message.error(res.msg);
            }
        });

    },
    stopTraceOthers: async ({ state, commit, rootState }: RoomContext) => {
        state.socket?.removeListener("addMapTrace");
        state.socket?.removeListener("addMapSpot");

    },
    exitRoom: async ({ state, commit, rootState }: RoomContext) => {
        console.log(79, 'exitRoom');
        state.socket?.emit('stopMapTrace', {
            mapTraceId: rootState.room.selfMapTraceId
        });
        state.socket?.disconnect()
        state.socket?.removeAllListeners();
        commit(types.EXIT_ROOM);
    },
    setIsShowMapSpot: async ({ commit }: RoomContext, isShowMapSpot: boolean) => {
        commit(types.SET_IS_SHOW_MAP_LOG, isShowMapSpot)
    },
    updateAllMapTraces: async ({ commit }: RoomContext, mapTraces: MapTrace[]) => {
        console.log(168, 'raw mapTraces', mapTraces);
        commit(types.UPDATE_ALL_MAP_TRACES, mapTraces);
    },
    clearAllMapTraces: async ({ commit }: RoomContext) => {
        commit(types.REMOVE_ALL_MAP_TRACES);
    },
    setSelfMapTraceId: async ({ commit }: RoomContext, selfMapTraceId: string) => {
        commit(types.SET_SELF_MAP_TRACE_ID, selfMapTraceId);
    },
}

export default actions;