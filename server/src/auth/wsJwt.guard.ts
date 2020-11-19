import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";
import { ExtractJwt } from "passport-jwt";
import { Socket } from 'socket.io';
import config from 'config';
import { AccountService } from "src/account/account.service";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { User } from "src/account/schemas/user.schema";
//https://stackoverflow.com/questions/58670553/nestjs-gateway-websocket-how-to-send-jwt-access-token-through-socket-emit
//https://stackoverflow.com/questions/55379366/i-need-help-to-verify-that-jwt-is-valid-or-otherwise-create-a-new-one-and-if-the

@Injectable()
export class WsJwtGuard extends AuthGuard('wsJwtStrategy') {
    private logger: Logger = new Logger(WsJwtGuard.name);

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
        });

    }

    // override getRequest for websocket
    getRequest<T = any>(context: ExecutionContext): T {
        return context.switchToWs().getClient().handshake;
    }

    // implements CanActivate class
    // async canActivate(context: ExecutionContext): Promise<boolean> {

    //     try {
    //         const socket: Socket = context.switchToWs().getClient<Socket>();
    //         const authToken: string = socket.handshake.query.token;
    //         console.log(35, 'wsJWT', authToken)

    //         // const user: User = await this.jwtStrategy.validateTest(authToken);
    //         // return Boolean(user)
    //         return false
    //     } catch (error) {
    //         throw new WsException(error.message)
    //     }
    // }
}