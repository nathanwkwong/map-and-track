import { RoomInfo } from '@/types/room'

export interface AccountState {
    accessToken: string,
    userId: string,
    username: string,
    // selfMapTraceId: string | null
    createdRooms: RoomInfo[],
    joinedRooms: RoomInfo[],
    isLoggedIn: boolean,
    isTraceSelfModeOn: boolean,
    isTraceOthersModeOn: boolean,
    isRestoringLogin: boolean,
    isShowMapSpot: boolean,
    isManualModeOn: boolean;
}

const accountState: AccountState = {
    userId: '',
    username: '',
    accessToken: '',
    joinedRooms: [],
    createdRooms: [],
    isLoggedIn: false,
    isTraceSelfModeOn: false,
    isTraceOthersModeOn: false,
    isRestoringLogin: true,
    isShowMapSpot: false,
    // selfMapTraceId: null,
    isManualModeOn: true
}


export default accountState;

