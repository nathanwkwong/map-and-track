//request
export interface CreateRoomReq {
    roomId: string;
    userId: string;
}

export interface JoinRoomReq {
    roomId: string;
    userId: string;
}

export interface RenewSelfMapTraceIdReq {
    userId: string;
}

export interface OthersIsTraceSelfModeOnRes{
    userId: string;
    isTraceSelfModeOn: boolean;
}