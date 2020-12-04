import { Injectable, UnauthorizedException, Logger, ConflictException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import mongoose from 'mongoose'
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AccountService {
  private logger = new Logger('AccountService');

  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    //for access the native Mongoose Connection object
    @InjectConnection() private connection: mongoose.Connection, 
    private jwtService: JwtService,
  ) { }

  async getUserNameById(userId: string): Promise<string> {
    const { username } = await this.userModel.findOne({ userId })
    return username;
  }

  async getUserInfo(userId: string) {
    let userInfo = (await this.userModel.aggregate([
      { $match: { userId } },
      { $project: { _id: 0, userId: 1, username: 1, selfMapTraceId: 1 } }
    ]))[0];
    const createdRooms = await this.getCreatedRooms(userId);

    const joinedRooms = await this.getJoinedRooms(userId);

    userInfo = { ...userInfo, ...createdRooms, ...joinedRooms }
    return userInfo;
  }

  async login(authCredentialsDto: AuthCredentialsDto): Promise<{}> {
    const { userId, username } = await this.validateUserPassword(authCredentialsDto);
    
    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { username };
    const options ={secret: process.env.JWT_SECRET}
    const accessToken = this.jwtService.sign(payload, options);
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

    await this.renewSelfMapTraceId(userId);
    const userInfo = await this.getUserInfo(userId);

    return { userInfo, accessToken };
  }

  async restoreLogin(userId: string): Promise<{}> {

    await this.renewSelfMapTraceId(userId);
    const userInfo = await this.getUserInfo(userId);

    return { userInfo };
  }

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashPassword = await this.hashPassword(password, salt)
    try {
      const user = new this.userModel({
        _id: new mongoose.Types.ObjectId,
        username: username,
        userId: uuid(),
        joinedRoomIds: [],
        createdRoomIds: [],
        salt,
        password: hashPassword,
        selfMapTraceId: null,
      })
      user.save();

    } catch (error) {
      console.log(error.message);
      if (error.code === '23505') { // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async renewSelfMapTraceId(userId: string){
    const selfMapTraceId: string = uuid();
    
      await this.userModel.updateOne({ userId }, {
        selfMapTraceId
      })

      return selfMapTraceId
  }

  async addJoinedRoomId(userId: string, roomId: string) {
    await this.userModel.updateOne({ userId }, {
      $push: { joinedRoomIds: roomId }
    });
  }

  async getUserObjectIDbyUUID(userUUID: string) {
    const _id = (await this.userModel.findOne({ userId: userUUID }, { _id: 1 }))._id;
    return _id;
  }

  async getJoinedRooms(userId: string) {
    const joinedRooms = (await this.userModel.aggregate([
      { $match: { userId } },
      { $project: { _id: 0, joinedRoomIds: 1 } },
      {
        $lookup: {
          from: "rooms",
          localField: "joinedRoomIds",
          foreignField: "roomId",
          as: "joinedRooms"
        }
      },
      { $unset: ["joinedRooms._id", "joinedRooms.userIds", "joinedRooms.mapTraces", "joinedRooms.mapSpots"] },
      { $project: { joinedRooms: 1 } },
    ]))[0];

    return joinedRooms;
  }

  async getCreatedRooms(userId: string) {
    const createdRoom = (await this.userModel.aggregate([
      { $match: { userId } },
      { $project: { _id: 0, createdRoomIds: 1 } },
      {
        $lookup: {
          from: "rooms",
          localField: "createdRoomIds",
          foreignField: "roomId",
          as: "createdRooms"
        }
        ,
      },
      { $unset: ["createdRooms._id", "createdRooms.userIds", "createdRooms.mapTraces", "createdRooms.mapSpots"] },
      { $project: { createdRooms: 1 } },
    ]))[0];
    return createdRoom;
  }

  async addCreatedRoomId(userId: string, roomId: string) {
    await this.userModel.updateOne({ userId }, {
      $addToSet: { createdRoomIds: roomId }
    });
  }

  async updateJoinedRooms(userId: string, roomId: string) {
    await this.userModel.updateOne({ userId }, {
      $addToSet: { joinedRoomIds: roomId }
    });
  }




  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;
    const user = await this.userModel.findOne({ username }).select('_id userId username password salt');
    console.log(user);
    const validatePassword = async (password: string) => {
      const hash = await bcrypt.hash(password, user.salt);
      return hash === user.password;
    }

    if (user && await validatePassword(password)) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

}
