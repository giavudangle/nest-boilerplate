import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../dtos/register-authentication.dto';
import { User } from '../../users/entities/user.entity';
import ITokenPayload from '../interfaces/token-payload.interface';
import { UserService } from '../../users/core/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * @param  {RegisterDto} registrationData
   * @returns Promise
   */
  public async register(registrationData: RegisterDto): Promise<User> {
    if (
      registrationData.email === undefined ||
      registrationData.password === undefined
    ) {
      throw new HttpException(
        'Please given email and password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userService.create({
        ...registrationData,
        password: hashedPassword,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === POSTGRE_ERROR_CODE.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
      }
    }
  }
  /**
   * @param  {string} email
   * @param  {string} hashedPassword
   * @returns Promise
   */
  public async getAuthenticateUser(
    email: string,
    hashedPassword: string,
  ): Promise<User> {
    try {
      const user = await this.userService.getByEmail(email);
      const isPasswordMatching = await bcrypt.compare(
        hashedPassword,
        user.password,
      );

      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      //user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  /**
   * @param  {number} userId
   * @returns string
   */
  public getCookieWithJwtAccessToken(userId: number): string {
    const payload: ITokenPayload = { userId };
    const token = this.jwtService.sign(payload,{
      secret:this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn:`${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
  }

  public getCookieForLogout() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ]
  }
  
  public getCookieWithJwtRefreshToken(userId : number){
    const payload  : ITokenPayload = {userId}
    const token = this.jwtService.sign(payload,{
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
    })
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`
    return {
      cookie,
      token
    }
  }

}
