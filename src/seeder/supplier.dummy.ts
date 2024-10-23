import { faker } from '@faker-js/faker';
import { CreateSupplierInput } from 'src/supplier/supplier.dto';

export const getDummySupplier = (userId: string): CreateSupplierInput => {
  const companyName = faker.company.name();
  const simplifiedCompanyName = companyName
    .replace(/[\s,-]+/g, '')
    .toLowerCase();

  return {
    name: companyName,
    businessEmail: `contact@${simplifiedCompanyName}.com`,
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    userId,
  };
};
