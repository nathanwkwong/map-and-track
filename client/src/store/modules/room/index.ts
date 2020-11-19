import { IRootState } from '@/store';
import { Module } from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import state, { RoomState } from './state';

const room: Module<RoomState, IRootState> ={
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}

export default room;