import { IRootState } from '@/store';
import { RoomInfo } from '@/types/room';
import { MutationTree } from 'vuex';
import * as types from './mutation-types'
import { AccountState } from './state';

const mutations: MutationTree<AccountState> = {
    [types.LOGIN](state: AccountState, payload: AccountState) {
        const { 
            userId, 
            username, 
            accessToken, 
            joinedRooms, 
            createdRooms, 
        } = payload;
        state.userId = userId;
        state.username = username;
        state.accessToken = accessToken;
        state.isLoggedIn = true;
        state.joinedRooms = joinedRooms;
        state.createdRooms = createdRooms;
        state.isRestoringLogin = false;
    },
    [types.RESTORE_LOGIN](state: AccountState, payload: AccountState) {
        const { 
            userId, 
            username, 
            joinedRooms, 
            createdRooms, 
        } = payload;
        state.userId = userId;
        state.username = username;
        state.isLoggedIn = true;
        state.joinedRooms = joinedRooms;
        state.createdRooms = createdRooms;
        state.isRestoringLogin = false;
    },
    [types.RESTORE_LOGIN_STATE](state: AccountState) {
        state.isLoggedIn = true;
    },
    [types.LOGOUT](state: AccountState) {
        state.accessToken = '';
        state.userId = '';
        state.username = '';
        state.isLoggedIn = false;
    },
    [types.GET_JOINED_ROOMS](state: AccountState, joinedRooms: RoomInfo[]) {
        state.joinedRooms = joinedRooms;
    },
    [types.GET_CREATED_ROOMS](state: AccountState, createdRooms: RoomInfo[]) {
        state.createdRooms = createdRooms;
    },
    [types.SET_IS_TRACE_SELF_MODE_ON](state: AccountState, isTraceSelfModeOn: boolean){
        state.isTraceSelfModeOn = isTraceSelfModeOn;
    },
    [types.SET_IS_TRACE_OTHERS_MODE_ON](state: AccountState, isTraceOthersModeOn: boolean){
        state.isTraceOthersModeOn = isTraceOthersModeOn;
    },
    [types.SET_IS_MANUAL_MODE_ON](state: AccountState, isManualModeOn: boolean){
        state.isManualModeOn = isManualModeOn;
    },
}

export default mutations;