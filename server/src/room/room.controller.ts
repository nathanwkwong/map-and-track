import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/createRoom.input.dto'
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/account/schemas/user.schema';
import { JoinRoomDto } from './dto/joinRoom.input.dto';

@Controller('/room')
@UseGuards(AuthGuard())
export class RoomController {
    private logger = new Logger('RoomController');

    constructor(
        private roomService: RoomService) { }

    @Get('/getRoomDetail/:roomId')
    public async getRoomDetailById(
        @Param('roomId') roomId: string
    ) {
        const roomDetail = await this.roomService.getRoomDetailById(roomId)
        return { success: true, data: roomDetail }
    }

    //require socket connection
    @Get('/getUsers/:roomId')
    public async getUsers(
        @Param('roomId') roomId: string
    ) {
        const users = await this.roomService.getUsers(roomId)
        return { success: true, data: users }
    }

    @Get('/getMapSpots/:roomId')
    async getMapSpots(
        @Param('roomId') roomId: string
    ) {
        const mapSpots = await this.roomService.getMapSpots(roomId);
        return { success: true, data: mapSpots }
    }

    @Get('/getMapTraces/:roomId')
    async getMapTraces(
        @Param('roomId') roomId: string,
        @GetUser() user: User
    ) {
        const { userId } = user;
        const mapTraces = await this.roomService.getMapTraces(roomId);
        return { success: true, data: mapTraces }
    }

    @Post('/createRoom')
    @UsePipes(ValidationPipe)
    async createRoom(
        @Body() createRoomDto: CreateRoomDto,
        @GetUser() user: User
    ) {
        console.log(6, user);
        const roomInfo = await this.roomService.createRoom(createRoomDto, user)
        return { success: true, data: roomInfo }
    }

    @Post('/joinRoom')
    async joinRoom(
        @Body() joinRoomDto: JoinRoomDto,
        @GetUser() user: User
    ) {
        const roomInfo = await this.roomService.joinRoom(joinRoomDto, user)
        return { success: true, data: roomInfo }
    }

    // @Delete('removeUserRoomRecord/:roomId')
    // async removeUserRoomRecord(
    //     @Param('roomId') roomId: string,
    //     @GetUser() user: User
    // ) {
    //     return this.roomService.removeUserRoomRecord(roomId, user);
    // }

}
