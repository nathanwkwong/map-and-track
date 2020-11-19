import { IRootState } from '@/store';
import { Module } from 'vuex';

import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import state, { AccountState } from './state';

const account: Module<AccountState, IRootState> ={
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
}

export default account;