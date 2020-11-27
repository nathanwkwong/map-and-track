import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const GetUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  const { user } = request;
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return user;
});