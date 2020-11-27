import { ExecutionContext, Logger, UseGuards } from "@nestjs/common";
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

import { Socket, Server } from "socket.io";
import { AccountService } from "src/account/account.service";
import { AddSpotDto } from "./dto/addSpot.input.dto";
import { AddTraceDto } from "./dto/addTrace.input.dto";
import { GeoLoc } from "./model/geoLoc.model";
import { RoomService } from "./room.service";
import { v4 as uuid } from 'uuid';
import { User, UserDocument } from "src/account/schemas/user.schema";
import { RCode } from "src/constants/rcode";
import { WsJwtGuard } from "../auth/wsJwt.guard";
import { GetWsHandshake } from "src/auth/get-ws-user.decorator";
import { JoinRoomDto } from './dto/joinRoom.input.dto';
import { Room, RoomDocument } from "./schemas/room.schema";
import { InjectModel } from "@nestjs/mongoose";
import { MapSpot } from "./schemas/mapSpot.schema";
import { MapTrace } from "./schemas/mapTrace.schema";
import { Model } from "mongoose";
import { StopMapTraceDto } from "./dto/stopMapTrace.dto";
// import { wsHandshakeDto } from "./dto/WsHandshake.dto";
import mongoose from "mongoose";
import { IsTraceSelfModeOnDto } from "./dto/IsTraceSelfModeOnDto.input.dto";
import {  IsNotEmpty} from 'class-validator';
export class wsHandshakeDto {
    @IsNotEmpty()
    roomId: string;

    @IsNotEmpty()
    user: User

    @IsNotEmpty()
    selfMapTraceId: string | null
}

@WebSocketGateway()
// lifecycle methods(handleConnection ,afterInit and handleDisconnect) are not guarded
@UseGuards(WsJwtGuard)
// @UseGuards(AuthGuard('wsJwtStrategy'))
export class RoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    // access the native platform-specific instance, auto assign by nestjs
    @WebSocketServer() private server: Server;

    constructor(
        @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly accountService: AccountService,
        private readonly roomService: RoomService
    ) { }

    private logger: Logger = new Logger('RoomGateway')
    getRequest<T = any>(context: ExecutionContext): T {
        return context.switchToHttp().getRequest();
    }

    handleConnection(client: Socket, ...args: any[]) { // WsResponse<WsRes>
        this.logger.log(`socket connected: ${client.id}`);
        const { userId, roomId } = client.handshake.query;

        console.log('WebSocketGateway:', client.handshake.query.roomId);
        client.join(roomId);
        client.join(userId);


        this.server.to(userId).emit('connect', {
            code: RCode.SUCCESS,
            msg: 'socket connected',
            data: 'testing'
        })
    }

    afterInit() {
        this.logger.log('Init');
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        const { roomId, userId, selfMapTraceId } = client.handshake.query;
        this.logger.log(`removeUser`);
        await this.roomService.removeUserById(roomId, userId);
        this.server.to(roomId).emit('removeUser', {
            code: RCode.SUCCESS,
            msg: 'remove user success',
            data: { userId }
        })
    }

    @SubscribeMessage('joinRoom')
    async handleJoinRoom(
        client: Socket,
        @GetWsHandshake() { roomId, user, selfMapTraceId }: wsHandshakeDto
    ): Promise<any> {
        this.logger.log('joinRoom');
        const { _id, userId, username } = user;
        this.logger.log(`addUser from user: ${username}`);
        await this.roomModel.updateOne({ roomId }, {
            $addToSet: { 'users': _id }
        });
        await this.accountService.updateJoinedRooms(userId, roomId);

        this.logger.log('roomInfo');
        const roomDetail = await this.roomService.getRoomDetailById(roomId);


        this.server.to(roomId).emit('addUser', {
            code: RCode.SUCCESS,
            msg: 'add new user success',
            data: { user: { userId, username } }
        })

        this.server.to(userId).emit('joinRoom', {
            code: RCode.SUCCESS,
            msg: 'join room success',
            data: { roomDetail }
        })
    }

    @SubscribeMessage('updateAllMapTraces')
    async handleGetMapTraces(
        @GetWsHandshake() { roomId, user, selfMapTraceId }: wsHandshakeDto
    ): Promise<any> {
        const mapTraces = (await this.roomService.getRoomDetailById(roomId)).mapTraces
        console.log(146, 'updateAllMapTraces', mapTraces);

        this.server.to(user.userId).emit('updateAllMapTraces', {
            code: RCode.SUCCESS,
            msg: 'update all mapTraces success',
            data: { mapTraces }
        })
    }

    @SubscribeMessage('updateUsersIsTraceSelfModeOn')
    async handleUpdateUsersIsTraceSelfModeOn(
        @MessageBody() { isTraceSelfModeOn }: IsTraceSelfModeOnDto,
        @GetWsHandshake() { roomId, user, selfMapTraceId }: wsHandshakeDto
    ): Promise<any> {
        const { userId } = user;
        this.logger.log(`updateUsersIsTraceSelfModeOn: ${userId}`);
        this.server.to(roomId).emit('updateUsersIsTraceSelfModeOn', {
            code: RCode.SUCCESS,
            msg: 'update Others isTraceSelfModeOn',
            data: { userId, isTraceSelfModeOn }
        })
    }

    @SubscribeMessage('addMapTrace')
    async handleAddMapTrace(
        @MessageBody() addTraceDto: AddTraceDto,
        @GetWsHandshake() { roomId, user }: wsHandshakeDto
    ): Promise<any> {
        this.logger.log(`addMapTrace, roomId:${roomId}`);
        const { coordinates, createdAt, mapTraceId } = addTraceDto;
        const { userId, username } = user;

        const roomInfo = await this.roomModel.findOne({ roomId })

        if (!roomInfo) {
            this.server.to(roomId).emit('addMapTrace', {
                code: RCode.FAIL,
                msg: 'add map trace failed',
                data: {}
            })
            return;
        }

        const geoLoc: GeoLoc = { type: 'Point', coordinates };

        const mapSpot = new MapSpot()
        mapSpot.geoLoc = geoLoc;
        mapSpot.mapSpotId = uuid();
        mapSpot.createdAt = createdAt;

        // @ts-ignore
        let room = await this.roomModel.findOneAndUpdate(
            {
                roomId,
                'mapTraces': {
                    $elemMatch: {
                        'mapTraceId': mapTraceId
                    }
                }
            },
            {
                $push: { 'mapTraces.$.userTraces': mapSpot },
                isActive : true
            },
            {
                select: {
                    _id: 0,
                    mapTraces: {
                        $elemMatch: { mapTraceId }
                    },
                    'mapTraces._id': 0,
                    'mapTraces.userTraces._id': 0
                },
                // arrayFilters: [{ 'mapTrace.mapTraceId': mapTraceId }],
                new: true,
            }
        ).populate('mapTraces.user', '-_id userId username', this.userModel).lean();
        console.log(215, 'populate', room);
        let mapTraceRes: any;
        if (room) {
            mapTraceRes = room.mapTraces[0];
            console.log(216, mapTraceRes);
        } else {
            // init a new map trace if no found
            const mapTrace = new MapTrace();
            mapTrace.mapTraceId = mapTraceId;

            mapTrace.user = user._id;

            mapTrace.isActive = true;
            mapTrace.userTraces = [mapSpot]
            mapTrace.createdAt = createdAt;

            await this.roomModel.updateOne(
                { roomId, },
                { $push: { mapTraces: mapTrace } },
                { upsert: true }
            );
            console.log(201, 'init', mapTrace);

            mapTraceRes = {
                // @ts-ignore
                mapTraceId: mapTrace.mapTraceId,
                user: {
                    userId,
                    username
                },
                isActive: mapTrace.isActive,
                userTraces: mapTrace.userTraces,
                createdAt
            }
        }
        console.log(243, mapTraceRes);
        this.server.to(userId).emit('updateSelfMapTrace', {
            code: RCode.SUCCESS,
            msg: 'update self map trace success',
            data: {
                mapSpot: mapSpot
            }
        })

        this.server.to(roomId).emit('addMapTrace', {
            code: RCode.SUCCESS,
            msg: 'add map trace success',
            data: {
                mapTrace: { ...mapTraceRes }
            }
        })
    }

    @SubscribeMessage('stopMapTrace')
    async handleStopMapTrace(
        @MessageBody() stopMapTraceDto: StopMapTraceDto,
        @GetWsHandshake() { roomId, user }: wsHandshakeDto
    ): Promise<any> {
        this.logger.log(`stopMapTrace, roomId:${roomId}`);
        const { mapTraceId } = stopMapTraceDto;
        const mapTrace = await this.roomService.deactivateMapTrace(mapTraceId, roomId);

        if (!mapTrace) {
            this.server.to(roomId).emit('stopMapTrace', {
                code: RCode.FAIL,
                msg: 'stop map trace failed',
                data: {}
            })
        } else {
            console.log(287, 'stopMapTrace, remove mapTrace:', mapTrace);
            this.server.to(roomId).emit('stopMapTrace', {
                code: RCode.SUCCESS,
                msg: 'a user stopped map trace success',
                data: { mapTraceId }
            })
        }
    }

    @SubscribeMessage('addMapSpot')
    async handleNewMapSpot(
        @MessageBody() addSpotDto: AddSpotDto,
        @GetWsHandshake() { roomId, user }: wsHandshakeDto
    ): Promise<any> {
        this.logger.log(`mapSpot, roomId:${roomId}`);
        const { coordinates, createdAt } = addSpotDto;

        const { userId, username } = user;
        const geoLoc: GeoLoc = { type: 'Point', coordinates }
        const mapSpot = new MapSpot();
        mapSpot.mapSpotId = uuid();
        mapSpot.user = user._id;
        mapSpot.geoLoc = geoLoc;
        mapSpot.createdAt = createdAt;

        await this.roomModel.updateOne(
            { roomId, },
            { $push: { mapSpots: mapSpot }, },
        );

        this.server.to(roomId).emit('addMapSpot', {
            code: RCode.SUCCESS,
            msg: 'add map spot success',
            data: {
                mapSpot: {
                    mapSpotId: mapSpot.mapSpotId,
                    user: {
                        userId,
                        username
                    },
                    geoLoc,
                    createdAt
                }
            }
        })
    }

    @SubscribeMessage('removeSelfRecord')
    async handleRemoveSelfRecord(
        client: Socket,
        @GetWsHandshake() { roomId, user }: wsHandshakeDto
    ): Promise<any> {

        const { userId } = user;
        const roomInfo: Room = await this.roomModel.findOne({ roomId });

        roomInfo.mapSpots = roomInfo.mapSpots.filter(mapSpot => {
            return mapSpot.user !== user._id;
        });

        roomInfo.mapTraces = roomInfo.mapTraces.filter(mapTrace => {
            return mapTrace.user !== user._id;
        });

        roomInfo.users = roomInfo.users.filter(_id => {
            return _id !== user._id;
        });

        return await this.roomModel.updateOne({ roomId }, roomInfo);
    }
}
