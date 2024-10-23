import { faker } from '@faker-js/faker';
import { CreateBuyerInput } from 'src/buyer/buyer.dto';

export const getDummyBuyer = (userId: string): CreateBuyerInput => {
  return {
    name: faker.person.fullName(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    userId,
  };
};
