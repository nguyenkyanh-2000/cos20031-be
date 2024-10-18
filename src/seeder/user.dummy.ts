import { CreateUserInput } from 'src/user/user.dto';
import { faker } from '@faker-js/faker';

export const getDummyUser = (): CreateUserInput => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};
