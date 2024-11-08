import { faker } from '@faker-js/faker';
import { CreateProductInput } from 'src/product/product.dto';
import { randomNumber } from './seeder.util';

export const getDummyProduct: ({
  name,
  productCategoryId,
  businessId,
  brand,
}: {
  name?: string;
  brand?: string;
  productCategoryId: string;
  businessId: string;
}) => CreateProductInput = ({ name, productCategoryId, brand, businessId }) => {
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

  const productName = name ? name : faker.commerce.productName();

  const productDescriptionTemplates = [
    `Experience the ${productName}—${adjectives.join(', ')}. 
  Crafted using premium ${features.join(', ')} materials, offering ${benefit}. 
  Ideal for anyone seeking both elegance and performance.`,
    `Meet your new fave, the ${productName}. It's ${adjectives.join(', ')}. 
Built with top-notch ${features.join(', ')} materials, so you get ${benefit}. 
A must-have for style lovers looking for that extra edge.`,
    `Introducing the ${productName}, a ${adjectives.join(', ')} solution. 
Engineered with advanced ${features.join(', ')} materials for ${benefit}. 
Designed for those who value both practicality and flair.`,
    `Introducing the ${productName}, a ${adjectives.join(', ')} solution. 
Engineered with advanced ${features.join(', ')} materials for ${benefit}. 
Designed for those who value both practicality and flair.`,
  ];

  return {
    name: productName,
    description:
      productDescriptionTemplates[
        randomNumber(0, productDescriptionTemplates.length - 1)
      ],
    brand: brand ? brand : faker.company.name(),
    productCategoryId,
    businessId,
  };
};
