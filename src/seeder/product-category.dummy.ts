import { faker } from '@faker-js/faker';
import { CreateProductCategoryInput } from 'src/product-category/product-category.dto';

export const getDummyProductCategory = (): CreateProductCategoryInput => {
  const name = faker.commerce.product();
  return {
    name,
    description: `This is a category for ${name}`,
  };
};
