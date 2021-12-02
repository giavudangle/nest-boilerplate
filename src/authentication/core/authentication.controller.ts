import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UserService } from '../../users/core/users.service';
import { User } from '../../users/entities/user.entity';
import { LoginDto } from '../dtos/login-authentication.dto';
import { RegisterDto } from '../dtos/register-authentication.dto';
import { JwtAccessTokenAuthenticationGuard } from '../guards/jwt-access-token-authentication.guard';
import { JwtRefreshTokenAuthenticationGuard } from '../guards/jwt-refresh-token-authentication.guard';
import { LocalAuthenticationGuard } from '../guards/local-authentication.guard';
import IRequestWithUser from '../interfaces/request-with-user.interface';
import { AuthenticationService } from './authentication.service';

@ApiTags('Authentication API')
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'exposeAll',
})
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService : UserService
    ) {}

  @Post('register')
  @ApiCreatedResponse({ type: User })
  @ApiBadRequestResponse()
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

    /**
   * @author Daniel Dang
   * @statement [AUTHENTICATION FLOW]
   * 1. The client-side will send a post request /login with their email and password.
   * Note that our server set cookie HttpOnly, so we can't check via js code.
   * 2. The server-side will authenticate email and password. And create new JWT.
   * @statement [EXPIRED ACCESS TOKEN]
   * 1. The client-side will request data with JWT Token on Header (we were set from cookie)
   * 2. The server-side will validate JWT and throw TokenExpiredError (in case of token expired)
   * 3. The server-side will return 401 and Token Expired Message to the client-side
   * @statement [MULTIPLE LOGIN AND SECURITY]
   * The server-side will override the old refresh token to get the lastest refresh token
   * The approach would leave the room for some CSRF attacks. One of the ways would be to maintain 
   * a same-origin policy and to have SameSite attribute set to Strict.
   * @param  {IRequestWithUser} request
   */
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(
    @Req()
    request: IRequestWithUser,
    @Body()
    loginData: LoginDto, // Display body request on Swagger UI
  ) {
    const user = request.user;

    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id)
    const {
      cookie: refreshTokenCookie,
      token : refreshToken
    } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(refreshToken,user.id)
    request.res.setHeader('Set-Cookie',[accessTokenCookie,refreshTokenCookie])
    return request.user
  }

  @UseGuards(JwtAccessTokenAuthenticationGuard)
  @Post('logout')
  @HttpCode(200)
  @ApiOkResponse()
  async logout(@Req() request: IRequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id)
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogout(),
    );
  }

    
  /**
   * This method help us authenticate a user with 
   * JWT Token given from cookie (when user logged in).
   * The cookie auto send to our server through browser
   * @middleware  {IRequestWithUser} request
   * @returns User
   */
  @UseGuards(JwtAccessTokenAuthenticationGuard)
  @Get('access')
  @ApiCookieAuth()
  @ApiOkResponse()
  authenticate(@Req() request: IRequestWithUser): User {
    return request.user;
  }

  
  /**
   * This method will generate a new access_token.
   * We check if the current access_token is expired.
   * Then we should call this method to get a new jwt token 
   * without trying to login anymore.
   * @author Daniel Dang
   * @statement [REFRESH TOKEN]
   * 1. The client-side will send Refresh Token (In Cookie) request to the route /authentication/refresh
   * 2. The server-side will verify the refresh token
   * 3. The server-side will return new token and refresh token
   * 4. The client-side request data with new JWT Token
   * @param  {IRequestWithUser} request
   */
  @UseGuards(JwtRefreshTokenAuthenticationGuard)
  @Get('refresh')
  refresh(@Req() request: IRequestWithUser){
    const accessTokenGivenFromCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id)
    request.res.setHeader('Set-Cookie',accessTokenGivenFromCookie)
    return request.user
  }


}
