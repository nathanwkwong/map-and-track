import { Module } from '@nestjs/common';
import { AuthController } from './account.controller';
import { AccountService } from './account.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import config from 'config';
import { WsJwtStrategy } from '../auth/wsJwt.Strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/account/schemas/user.schema';
import { Room, RoomSchema } from 'src/room/schemas/room.schema';

const jwtConfig: any = config.get('jwt');

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expiresIn || 999999999,
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
