import { User } from '@/types/account'
import { MapSpot, MapTrace } from '../../types/room';

//request
export interface AuthRes {
    username: string,
    password: string
}

//response
// export interface AuthResponse extends Response {
//     user: User;
// }

export interface CreateRoomResponse {
    roomId: string;
    user: User
}

export interface JoinRoomRes {
    roomId: string;
    roomName: string;
    users: User[];
    mapTraces: MapTrace[];
    mapSpots: MapSpot[]
}