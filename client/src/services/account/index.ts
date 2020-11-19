import { AuthRes } from '@/services/account/types';

import REST from '../index';

export default {
    login(authData: AuthRes){
        return REST.API({
            url: '/api/account/login',
            method: 'POST',
            data: authData
        })
    },
    signup(authData: AuthRes){
        return REST.API({
            url: '/api/account/signup',
            method: 'POST',
            data: authData
        })
    },
    restoreLogin(){
        return REST.API({
            url: '/api/account/restoreLogin',
            method: 'POST'
        })
    },
    getJoinedRooms(){
        return REST.API({
            url: '/api/account/getJoinedRooms',
            method: 'GET'
        })
    },
    getCreatedRooms(){
        return REST.API({
            url: '/api/account/getCreatedRooms',
            method: 'GET'
        })
    }
}



