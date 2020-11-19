import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetWsHandshake = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToWs().getClient();
  const { user } = request.handshake;
  const { roomId, selfMapTraceId } = request.handshake.query;
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return {user, roomId, selfMapTraceId};
});