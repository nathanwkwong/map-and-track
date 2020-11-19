import { GetterTree } from 'vuex';
import { AccountState } from './state';
import { IRootState } from '../../index';

const getters: GetterTree<AccountState, IRootState> = {
    userId: (state: AccountState) => {
        return state.userId;
    },
    username: (state: AccountState) => {
        return state.username;
    },
    joinedRooms: (state: AccountState) => {
        return state.joinedRooms;
    },
    createdRooms: (state: AccountState) => {
        return state.createdRooms
    },
    isLoggedIn: (state: AccountState) => {
        return state.isLoggedIn
    },
    isTraceSelfModeOn: (state: AccountState) => {
        return state.isTraceSelfModeOn
    },
    isTraceOthersModeOn: (state: AccountState) => {
        return state.isTraceOthersModeOn
    },
    isRestoringLogin: (state: AccountState) => {
        return state.isRestoringLogin
    },
    isManualModeOn: (state: AccountState) => {
        return state.isManualModeOn
    },
    
}


export default getters;