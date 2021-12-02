import { User } from '../../users/entities/user.entity';

const mockedUser: User = {
  id: 1,
  email: 'daniel.dang@contemi.com',
  name: 'Daniel Dang',
  password: 'danielne',
  address: {
    id: 1,
    street: '67 Huynh Thien Loc',
    city: 'Ho Chi Minh',
    country: 'Vietnam',
  },
};

export default mockedUser;
