import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { User, UserDocument } from 'src/account/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsJwtStrategy') {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  //validate when UserGuards() is applied
  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userModel.findOne({ username }).select('_id userId username');
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

}
