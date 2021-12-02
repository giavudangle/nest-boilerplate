import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../core/users.service';
import { User } from '../entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: { findOne },
        },
      ],
    }).compile();

    service = await module.get<UserService>(UserService);
  });

  describe('When getting a user by email', () => {
    describe('The user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const fetchedUser = await service.getByEmail('daniel.dang@contemi.com');
        expect(fetchedUser).toEqual(user);
      });
    });

    describe('The user is not matched', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should throw an null value', async () => {
        await expect(
          service.getByEmail('daniel.dang@contemi.com'),
        ).resolves.toBeNull();
      });
    });
  });
});
