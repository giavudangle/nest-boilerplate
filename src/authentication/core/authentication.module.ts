import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from '../strategies/local.strategy';
import { UserModule } from '../../users/core/users.module';
import { JwtRefreshTokenStrategy } from '../strategies/jwt-refresh-token.strategy';
import { JwtAccessTokenStrategy } from '../strategies/jwt-access-token.strategy';
@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  providers: [AuthenticationService,LocalStrategy,JwtRefreshTokenStrategy,JwtAccessTokenStrategy ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
