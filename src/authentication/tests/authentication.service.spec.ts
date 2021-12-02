import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { UserService } from '../../users/core/users.service';
import { User } from '../../users/entities/user.entity';
import { AuthenticationService } from '../core/authentication.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedConfigService } from '../../shared/mocks/config-service.mock';
import { mockedJwtService } from '../../shared/mocks/jwt-service.mock';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();
    authenticationService = await module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  describe('When creating a cookie', () => {
    it('should be return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual('string');
    });
  });
});
