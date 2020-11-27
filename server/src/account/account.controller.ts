import { AuthGuard } from '@nestjs/passport';
import { Controller, Post, Body, ValidationPipe, Param, Get, Logger, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/account/schemas/user.schema';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AccountService } from './account.service';

@Controller('/account')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(
    private accountService: AccountService,
  ) { }

  @Post('/signup')
  signUp(@Body() authCredentialsDto: AuthCredentialsDto) {
    const { username } = authCredentialsDto
    this.accountService.signUp(authCredentialsDto);
    return { success: true, data: { username } }
  }

  @Post('/login')
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    this.logger.debug(`AuthController, /login`);
    const userInfo = await this.accountService.login(authCredentialsDto);
    return { success: true, data: userInfo }
  }

  @Post('/restoreLogin')
  @UseGuards(AuthGuard())
  async restoreLogin(
    @GetUser() user: User
  ) {
    this.logger.debug(`AuthController, /restoreLogin`);
    const { userId } = user;
    const userInfo = await this.accountService.restoreLogin(userId);
    return { success: true, data: userInfo }
  }

  @Get('/getJoinedRooms')
  @UseGuards(AuthGuard())
  async getJoinedRooms(
    @GetUser() user: User
  ) {
    const { userId } = user;
    const joinedRooms = await this.accountService.getJoinedRooms(userId);
    return { success: true, data: joinedRooms }
  }

  @Get('/getCreatedRooms')
  @UseGuards(AuthGuard())
  async getCreatedRooms(
    @GetUser() user: User
  ) {
    this.logger.debug(`AuthController, /getCreatedRooms`);
    const { userId } = user;
    const createdRoom = await this.accountService.getCreatedRooms(userId);
    return { success: true, data: createdRoom }
  }

  @Get('/renewSelfMapTraceId')
  @UseGuards(AuthGuard())
  async renewSelfMapTraceId(
    @GetUser() user: User
  ) {
    this.logger.log(`AuthController, /renewSelfMapTraceId`);
    const { userId } = user;
    const selfMapTraceId = await this.accountService.renewSelfMapTraceId(userId)
    return { success: true, data: { selfMapTraceId } }
  }
}
