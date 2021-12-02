import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as supertest from 'supertest';
import { Route } from '../../shared/enums/route.enum';
import { mockedConfigService } from '../../shared/mocks/config-service.mock';
import { mockedJwtService } from '../../shared/mocks/jwt-service.mock';
import mockedUser from '../../shared/mocks/user.mock';
import { UserService } from '../../users/core/users.service';
import { User } from '../../users/entities/user.entity';
import { AuthenticationController } from '../core/authentication.controller';
import { AuthenticationService } from '../core/authentication.service';

describe('The AuthenticationController Integration Testing', () => {
  let app: INestApplication;
  let userData: User;

  beforeEach(async () => {
    const userRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
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

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('When registering', () => {
    describe('Using valid data', () => {
      it('Should respond with the data of user without contain password', () => {
        const expectedData = { ...userData };
        delete expectedData.password;
        return supertest(app.getHttpServer())
          .post(`${Route.AUTH}/register`)
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: mockedUser.password,
          })
          .expect(201)
          .expect(expectedData);
      });
    });

    describe('Using invalid data', () => {
      it('Should throw an error', () => {
        return supertest(app.getHttpServer())
          .post(`${Route.AUTH}/register`)
          .send({
            name: mockedUser.name,
          })
          .expect(400);
      });
    });
  });
});
