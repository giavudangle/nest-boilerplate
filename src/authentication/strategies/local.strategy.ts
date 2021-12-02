import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AuthenticationService } from '../core/authentication.service';
import { STRATEGY_TYPE } from '../enums/authentication.enum';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,STRATEGY_TYPE.LOCAL_STRATEGY) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email', //override base field of local strategy
    });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticateUser(email, password);
  }
}
