import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { WsJwtStrategy } from 'src/auth/wsJwt.Strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { User, UserSchema } from 'src/account/schemas/user.schema';
import { Room, RoomSchema } from 'src/room/schemas/room.schema';
import { AuthController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 999999999,
      },
    }),
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Room.name, schema: RoomSchema},
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AccountService,
    JwtStrategy,
    WsJwtStrategy
  ],
  exports: [
    JwtStrategy,
    WsJwtStrategy,
    PassportModule,
    AccountService
  ],
})
export class AccountModule {}
