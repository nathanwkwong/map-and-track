import { ActionContext, ActionTree } from 'vuex'
import router from '@/router';
import API from '@/services/call';
import { IRootState } from '@/store'
import { getItemSync, KEY, setItemSync } from '@/store/storage'
import * as types from '@/store/modules/account/mutation-types'
import * as typesRoom from '@/store/modules/room/mutation-types'
import { AuthRes } from "@/services/account/types"
import { AccountState } from './state';

type AccountContext = ActionContext<AccountState, IRootState>

const actions: ActionTree<AccountState, IRootState> = {
    login: async ({ commit }: AccountContext, authData: AuthRes) => {
        try {
            const res = await API.account.login(authData)
            if (res && res.data.success) {
                const { accessToken, userInfo } = res.data.data;
                console.log('login', res.data.data);
                const credential = { isLogin: true, userId: userInfo.userId }
                setItemSync(KEY.CREDENTIAL, credential, true)
                setItemSync(KEY.ACCESS_TOKEN, accessToken, false);
                commit(types.LOGIN, { ...userInfo, accessToken })
                if (router.currentRoute.path !== "/lobby") {
                    router.push("/lobby")
                }
            }
        } catch (err) {
            console.log('failed to login', err)
        }
    },
    restoreLogin: async ({ commit, dispatch }: AccountContext) => {
        try {
            dispatch(`room/exitRoom`, null, { root: true }); //must exit room and then return lobby
            const accessToken = getItemSync(KEY.ACCESS_TOKEN, '', false);
            const credential = getItemSync(KEY.CREDENTIAL, '', true);
            if (accessToken === '') {
                localStorage.removeItem(KEY.ACCESS_TOKEN);
                return;
            }
            if (credential.isLogin) {
                commit(types.RESTORE_LOGIN_STATE)

                const res = await API.account.restoreLogin();
                if (res && res.data.success) {
                    const { userInfo } = res.data.data;
                    if (router.currentRoute.path !== "/lobby") {
                        router.push("/lobby")
                    }
                    commit(types.RESTORE_LOGIN, { ...userInfo })
                }
            } else {
                commit(types.LOGOUT);
            }
        } catch (error) {
        }
    },
    signup: async ({ commit }: AccountContext, authData: AuthRes) => {
        try {
            const res = await API.account.signup(authData)
            if (res && res.data.success) {
                alert('sign up success')
            } else {
                alert('sign up failed')
            }

            if (router.currentRoute.path !== "/") {
                router.push("/");
            }
        } catch (err) {
            console.log('failed to signup', err)
        }
    },
    logout: ({ commit, dispatch }: AccountContext) => {
        localStorage.removeItem(KEY.CREDENTIAL);
        localStorage.removeItem(KEY.ACCESS_TOKEN);
        console.log(79, 'logout');
        dispatch(`room/exitRoom`, null, { root: true });
        commit(types.LOGOUT);
        router.push('/login');
    },
    getJoinedRooms: async ({ commit }: AccountContext) => {
        try {
            const res = await API.account.getJoinedRooms();
            if (res && res.data.success) {
                console.log('88 getJoinRooms', res.data.data)
                commit(types.GET_JOINED_ROOMS, res.data.data.joinedRooms)
            }
        } catch (error) {
            console.log('filed to get getJoinedRooms', error)
        }
    },
    getCreatedRooms: async ({ commit }: AccountContext) => {
        try {
            const res = await API.account.getCreatedRooms();
            if (res && res.data.success) {
                commit(types.GET_CREATED_ROOMS, res.data.data.createdRooms)
            }
        } catch (error) {
            console.log('filed to get getJoinedRooms', error)
        }
    },
    setIsTraceSelfModeOn: async ({ rootState, commit }: AccountContext, isTraceSelfModeOn: boolean) => {
        rootState.room.socket?.emit("updateUsersIsTraceSelfModeOn", {
            isTraceSelfModeOn
        })
        commit(types.SET_IS_TRACE_SELF_MODE_ON, isTraceSelfModeOn);
    },
    setIsTraceOthersModeOn: async ({ commit }: AccountContext, isTraceOthersModeOn: boolean) => {
        commit(types.SET_IS_TRACE_OTHERS_MODE_ON, isTraceOthersModeOn);
    },
    setIsManualModeOn: async ({ commit }: AccountContext, isManualModeOn: boolean) => {
        commit(types.SET_IS_MANUAL_MODE_ON, isManualModeOn);
    },
}

export default actions;