import { faker } from '@faker-js/faker';
import { CreateBusinessInput } from 'src/business/business.dto';
import { randomNumber } from './seeder.util';

export const getDummyBusiness = (): CreateBusinessInput => {
  const companyName = faker.company.name();
  const simplifiedCompanyName = companyName
    .replace(/[\s,-]+/g, '')
    .toLowerCase();

  const emailPrefixes = [`contact`, `business`, `sale`, `hello`, `meet`];

  return {
    name: companyName,
    email: `${emailPrefixes[randomNumber(0, emailPrefixes.length - 1)]}@${simplifiedCompanyName}.com`,
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
  };
};
