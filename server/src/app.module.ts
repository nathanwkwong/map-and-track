import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccountModule } from './account/account.module';
import { RoomModule } from './room/room.module';
import config from '../config/default';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { user, password, clusterName, dbName } = configService.get<any>('db');
        return ({
          uri: `mongodb+srv://nathandriver:nathandriver@cluster0.xpaqi.mongodb.net/map-and-track?retryWrites=true&w=majority`
          // uri: `mongodb+srv://${user}:${password}@${clusterName}.xpaqi.mongodb.net/${dbName}?retryWrites=true&w=majority`
        })
      }
    }),
    RoomModule,
    AccountModule,
  ],
})
export class AppModule { }
