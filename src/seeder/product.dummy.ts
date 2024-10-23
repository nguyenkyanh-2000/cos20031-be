import { faker } from '@faker-js/faker';
import { CreateProductInput } from 'src/product/product.dto';

export const getDummyProduct: ({
  name,
  productCategoryId,
  supplierId,
}: {
  name?: string;
  productCategoryId: string;
  supplierId: string;
}) => CreateProductInput = ({ name, productCategoryId, supplierId }) => {
  const adjectives = [
    faker.commerce.productAdjective(),
    faker.commerce.productAdjective(),
    faker.commerce.productAdjective(),
  ];
  const features = [
    faker.commerce.productMaterial(),
    faker.commerce.productMaterial(),
    faker.commerce.productMaterial(),
  ];
  const benefit = faker.company.catchPhrase();

  const productName = name
    ? `${adjectives[0]} ${adjectives[1]} ${name}`
    : faker.commerce.productName();
  const productDescription = `The ${productName} is ${adjectives.join(', ')}.
  Made with high-quality ${features.join(', ')} materials, it ensures ${benefit}. 
  Perfect for those who appreciate a touch of style and durability.`;

  return {
    name: productName,
    description: productDescription,
    productCategoryId,
    supplierId,
  };
};
