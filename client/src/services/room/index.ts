import { CreateRoomReq, JoinRoomReq, RenewSelfMapTraceIdReq } from '@/services/room/types'
import REST from '../index';

export default {
    createRoom(payload: CreateRoomReq) {
        console.log(6, 'createRoom');
        //return new room information
        return REST.API({
            url: '/api/room/createRoom',
            method: 'POST',
            data: payload
        })        
    },
    joinRoom(payload: JoinRoomReq) {
        return REST.API({
            url: '/api/room/joinRoom',
            method: 'POST',
            data: payload
        }) 
    },
    renewSelfMapTraceId(payload: RenewSelfMapTraceIdReq){
        return REST.API({
            url: '/api/account/renewSelfMapTraceId',
            method: 'GET',
            data: payload
        })
    }
}



