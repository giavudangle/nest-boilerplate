import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GUARD_TYPE } from '../enums/authentication.enum';

@Injectable()
export class JwtAccessTokenAuthenticationGuard extends AuthGuard(GUARD_TYPE.JWT_ACCESS_TOKEN_GUARD) {}
