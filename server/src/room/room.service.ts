import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { CreateRoomDto } from './dto/createRoom.input.dto';
import { JoinRoomDto } from './dto/joinRoom.input.dto';
import { AccountService } from 'src/account/account.service';
import { Room, RoomDocument } from 'src/room/schemas/room.schema';
import { User, UserDocument } from 'src/account/schemas/user.schema';
import mongoose from 'mongoose'

@Injectable()
export class RoomService {
    constructor(
        @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectConnection() private connection: Connection, //to access the native Mongoose Connection object
        private readonly accountService: AccountService
    ) { }

    async getRoomInfoById(roomId: string) {
        const roomInfo = await this.roomModel.findOne({ roomId }, { _id: 0 })
        return roomInfo
    }

    async getRoomDetailById(roomId: string) {
        //TODO: improve algorithm
        // const roomInfo = (await this.roomModel.aggregate([
        //     { $match: { roomId } },
        //     { $project: { _id: 0, roomId: 1, roomName: 1,mapTraces :1, mapSpots: 1} }]))[0]
        // const users = await this.getUsers(roomId);
        // const mapTraces = await this.getMapTraces(roomId);
        // const mapSpots = await this.getMapSpots(roomId);
        // const roomDetail = { ...roomInfo, users };
        const roomDetail = await this.roomModel
            .findOne({ roomId })
            .populate('users', '-_id userId username', this.userModel)
            .populate('mapTraces.user', '-_id userId username', this.userModel)
            .populate('mapSpots.user', '-_id userId username', this.userModel)
            .select('-_id -mapSpots._id -mapTraces._id')
            .exec();
        console.log(45, roomDetail);
        return roomDetail;
    }

    async createRoom(createTaskDto: CreateRoomDto, user: User) {
        const { roomName } = createTaskDto;
        const { _id, userId } = user;
        const roomId = uuid();

        const room = {
            roomId,
            roomName: roomName,
            creator: userId,
            user: _id,
            users: [],
            mapTraces: [],
            mapSpots: [],
            createdAt: new Date()
        }
        await this.roomModel.create({
            _id: new mongoose.Types.ObjectId,
            ...room
        });
        await this.accountService.addCreatedRoomId(userId, roomId)

        return room;
    }

    async joinRoom(joinRoomDto: JoinRoomDto, user: User) {
        const { roomId } = joinRoomDto;
        const { _id, userId } = user

        await this.roomModel.updateOne({ roomId }, {
            $push: { users: _id },
        });
        await this.accountService.addJoinedRoomId(userId, roomId)

        const roomInfo = await this.getRoomDetailById(roomId)
        return roomInfo;
    }

    async getUsers(roomId: string) {
        const usersWithName = (await this.roomModel.aggregate([
            { $match: { roomId } },
            { $project: { _id: 0, roomId: 1, userIds: 1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "userIds",
                    foreignField: "userId",
                    as: "users",
                }
            },
            { $project: { users: 1 } },
            {
                $project: {
                    'users._id': 0,
                    'users.createdRoomIds': 0,
                    'users.joinedRoomIds': 0,
                    'users.salt': 0,
                    'users.password': 0,
                    'users.selfMapTraceId': 0,
                }
            },
        ]))[0];
        if (!usersWithName) {
            return {}
        }
        return usersWithName.users;
    }

    async getMapTraces(roomId: string) {
        const mapTracesWithUserName = (await this.getRoomInfoById(roomId)).mapTraces;
        if (mapTracesWithUserName.length === 0) {
            return {}
        }

        // await this.asyncForEach(mapTracesWithUserName, async (mapTrace: MapTrace, index: number) => {
        //     mapTracesWithUserName["username"] = await this.accountService.getUserNameById(mapTrace.userId);
        // })
        return mapTracesWithUserName
    }

    async getMapSpots(roomId: string) {
        const mapSpotsWithUserName = (await this.getRoomInfoById(roomId)).mapSpots;
        if (mapSpotsWithUserName.length === 0) {
            return {}
        }
        // await this.asyncForEach(mapSpotsWithUserName, async (mapSpot: MapSpot, index: number) => {
        //     mapSpot["username"] = await this.accountService.getUserNameById(mapSpot.userId);
        //     console.log(125, mapSpot["username"]);
        // })
        return mapSpotsWithUserName;
    }

    async removeUserById(roomId: string, userId: string) {
        const _id = await this.accountService.getUserObjectIDbyUUID(userId);
        console.log(_id);
        const result = await this.roomModel.updateOne({ roomId }, {
            $pull: { users: _id }
        });
    }

    async deactivateMapTrace(mapTraceId: string, roomId: string) {
        const mapTrace = await this.roomModel.findOneAndUpdate(
            {
                roomId,
                'mapTraces': {
                    $elemMatch: {
                        'mapTraceId': mapTraceId
                    }
                }
            },
            {
                $set: { 'mapTraces.$.isActive': false },
            },
            {
                select: {
                    _id: 0,
                    mapTraces: {
                        $elemMatch: { mapTraceId: mapTraceId }
                    }
                },
                // arrayFilters: [{ element: { 'mapTrace.mapTraceId': mapTraceId } }],
                new: true
            },
        );
        return mapTrace;
    }


    async asyncForEach(array: any[], callback: Function) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    async asyncForEachObject(obj: {}, callback: Function) {
        for (let key in obj) {
            const value = obj[key];
            await callback(value, key);
        }
    }
}
