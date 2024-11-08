import { faker } from '@faker-js/faker';
import { CreateProductVariantInput } from 'src/product-variant/product-variant.dto';
import { randomElementsFromArray, randomNumber } from './seeder.util';

export const getDummyProductVariant = ({
  productName,
  productId,
}: {
  productName: string;
  productId: string;
}): CreateProductVariantInput => {
  const randomPictures = Array.from({ length: 5 }, () =>
    faker.image.urlLoremFlickr({ category: productName }),
  );

  return {
    name: `${faker.commerce.productMaterial()}, ${faker.color.human()}`,
    price: faker.number.float({ min: 0.5, max: 1000.0, fractionDigits: 2 }),
    stock: faker.number.int({ max: 1000 }),
    images: randomElementsFromArray(randomPictures, randomNumber(1, 5)),
    productId,
  };
};
