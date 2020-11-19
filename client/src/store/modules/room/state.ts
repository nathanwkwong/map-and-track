import { User } from '@/types/account'
import { MapTrace, MapSpot, MapSpotBasic } from '@/types/room'
import {} from "googlemaps";
// const initUser: User ={
//     userId: '',
//     username: '',
// }

// export const initSelfMapTrace: MapTrace = {
//     mapTraceId: '',
//     user:initUser,
//     isActive: false,
//     userTraces: [],
//     createdAt: new Date()
// }

export interface RoomState {
    roomId: string;
    roomName: string;
    map: google.maps.Map | null;
    selfMapTraceId: null | string;
    selfMapTraces: MapSpotBasic[];
    lastUpdatedMapTraceId: string| null;
    coordinates: number[]; // [long, lat]
    users: User[];
    mapTraces: MapTrace[];
    mapSpots: MapSpot[];
    socket: null | SocketIOClient.Socket;
    isShowMapSpot: boolean;
}

const roomState: RoomState = {
    roomId: '',
    roomName: '',
    map: null,
    coordinates: [114.177216, 22.302711], // Hong Kong
    selfMapTraceId: null,
    selfMapTraces: [],
    // lastSelfMapTrace: null;
    users: [],
    mapTraces: [],
    lastUpdatedMapTraceId: null,
    mapSpots: [],
    // @ts-ignore
    socket: null,
    isShowMapSpot: false,
}

export default roomState;





