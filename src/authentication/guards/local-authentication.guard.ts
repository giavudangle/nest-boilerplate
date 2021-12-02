import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GUARD_TYPE } from '../enums/authentication.enum';

@Injectable()
export class LocalAuthenticationGuard extends AuthGuard(GUARD_TYPE.LOCAL_GUARD) {}
