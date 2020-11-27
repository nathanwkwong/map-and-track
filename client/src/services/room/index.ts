import { CreateRoomReq, JoinRoomReq, RenewSelfMapTraceIdReq } from '@/services/room/types'
import REST from '../index';
import { KEY } from '@/store/storage';

export default {
    createRoom(payload: CreateRoomReq) {
        //return new room information
        return REST.API({
            url: '/api/room/createRoom',
            method: 'POST',
            data: payload,            
            // headers: {
            //     'Authorization': `Bearer ${window.localStorage.getItem(KEY.ACCESS_TOKEN)}`,
            // }
        })
    },
    joinRoom(payload: JoinRoomReq) {
        return REST.API({
            url: '/api/room/joinRoom',
            method: 'POST',
            data: payload
        })
    },
    renewSelfMapTraceId(payload: RenewSelfMapTraceIdReq) {
        return REST.API({
            url: '/api/account/renewSelfMapTraceId',
            method: 'GET',
            data: payload
        })
    }
}



