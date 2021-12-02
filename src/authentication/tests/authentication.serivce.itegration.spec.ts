import mockedUser from '../../shared/mocks/user.mock';
import { UserService } from '../../users/core/users.service';
import { User } from '../../users/entities/user.entity';
import { AuthenticationService } from '../core/authentication.service';
import * as bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../../shared/mocks/config-service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../shared/mocks/jwt-service.mock';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('The AuthenticationService Integration Testing', () => {
  let authenticationService: AuthenticationService;
  let usersService: UserService;
  let bcryptCompare: jest.Mock;
  let userData: User;
  let findUser: jest.Mock;

  beforeEach(async () => {
    userData = {
      ...mockedUser,
    };
    findUser = jest.fn().mockResolvedValue(userData);
    const userRepository = {
      findOne: findUser,
    };

    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

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
          useValue: userRepository,
        },
      ],
    }).compile();

    authenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
    usersService = module.get<UserService>(UserService);
  });

  describe('When accessing the data of authenticating user', () => {
    it('Should attempt to get a user by email', async () => {
      const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');
      await authenticationService.getAuthenticateUser(
        'daniel.dang@contemi.com',
        'danielne',
      );
      expect(getByEmailSpy).toBeCalledTimes(1);
    });

    describe('Provide invalid password', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('Should throw an error because we did not find user', async () => {
        await expect(
          authenticationService.getAuthenticateUser(
            'daniel.dang@contemi.com',
            'danielne',
          ),
        ).rejects.toThrow();
      });
    });

    describe('Provide valid password', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('Found the user in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        });
        it('Should return the user data', async () => {
          const user = await authenticationService.getAuthenticateUser(
            'daniel.dang@contemi.com',
            'danielne',
          );
          expect(user).toBe(userData);
        });
      });
    });

    describe('The user is not found in the database', () => {
      beforeEach(() => {
        findUser.mockResolvedValue(undefined);
      });
      it('should throw an error', async () => {
        await expect(
          authenticationService.getAuthenticateUser(
            'daniel.dang@contemi.com',
            'danielne',
          ),
        ).rejects.toThrow();
      });
    });
  });
});
