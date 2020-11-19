
import account from '@/services/account/index'
import room from '@/services/room/index'

class APICall {
    account = account;
    room = room;
}

export default new APICall();