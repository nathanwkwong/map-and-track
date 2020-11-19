import { User } from '@/types/account'

interface WsRes {
    code: number;
    msg: string;
    data: any;
}

export interface GeoLoc {
    type: string;
    coordinates: number[]; // [lng, lat] // for mongodb
}

export interface MapSpotBasic {
    mapSpotId: string;
    geoLoc: GeoLoc; // lng, lat
    createdAt: Date;
}

export interface MapSpot extends MapSpotBasic {
    mapSpotName: string;
    user?: User;
}

export interface SelfMapTrace {
    mapSpots: MapSpot[]
}

export interface MapTrace {
    mapTraceId: string
    user: User;
    isActive: boolean;
    userTraces: MapSpot[];
    createdAt: Date;
    marker: google.maps.Marker;
    infoWindow: google.maps.InfoWindow;
}

export interface RoomInfo {
    roomId: string,
    roomName: string,
    creator: string
    createdAt: Date,
}

export interface RoomDetail extends RoomInfo {
    usersTraceList: MapTrace[]
}