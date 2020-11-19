import Vue from 'vue'
import Vuex, { ModuleTree } from 'vuex'

import room from './modules/room';
import account from './modules/account';

import { AccountState } from '@/store/modules/account/state'
import { RoomState } from '@/store/modules/room/state'

Vue.use(Vuex)

export interface IRootState {
  account: AccountState,
  room: RoomState
}

const modules: ModuleTree<IRootState> = {
  account,
  room
}
const store = new Vuex.Store<IRootState>({
  modules
})

export default store;

// import * as account from "./modules/account/state"
// account: {
//   ...account,
//   namespaced: true
// },