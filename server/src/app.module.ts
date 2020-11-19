import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { RoomModule } from './room/room.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseConfig } from './config/mongoose.config';
import { NestFactory } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(mongooseConfig.uri), 
    // MongooseModule.forRootAsync({
      // imports: [ConfigModule],
      // inject: [ConfigService],
      // useFactory: async (configService: ConfigService) => {
        // console.log('hiiiiiiiiiiii');
        // uri: `mongodb+srv://${configService["user"]}:${configService["password"]}@${configService["clusterName"]}.xpaqi.mongodb.net/${configService["name"]}?retryWrites=true&w=majority`
        // uri: `mongodb+srv://nathandriver:nathandriver@cluster0.xpaqi.mongodb.net/map-and-track?retryWrites=true&w=majority`
      // }
    // }), 
    ConfigModule.forRoot(),
    RoomModule,
    AccountModule,
  ],
})
export class AppModule { }
