import { Module } from '@nestjs/common';
import { AccountModule } from 'src/account/account.module';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { User, UserSchema } from 'src/account/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Room.name, schema: RoomSchema},
      {name: User.name, schema: UserSchema}
    ]),
    AccountModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
})
export class RoomModule {}
