import { PrismaService } from 'src/prisma/prisma.service';
import { getDummyUser } from './user.dummy';
import { each } from 'bluebird';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { normalizeEmail } from 'validator';
import { CreateUserInput } from 'src/user/user.dto';
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from 'src/core/auth/auth.const';
import { CreateProductCategoryInput } from 'src/product-category/product-category.dto';
import { getDummyProductCategory } from './product-category.dummy';
import { BusinessMemberRole, ProductCategory } from '@prisma/client';
import { getDummyProduct } from './product.dummy';
import { CreateProductInput } from 'src/product/product.dto';
import { randomNumber, randomElementsFromArray } from './seeder.util';
import { getDummyProductVariant } from './product-variant.dummy';
import { CreateProductVariantInput } from 'src/product-variant/product-variant.dto';
import { getDummyBusiness } from './business.dummy';
import { CreateBusinessInput } from 'src/business/business.dto';

async function seeder(
  prismaService: PrismaService,
  configs: {
    nCustomers: number;
    nBusinesses: number;
    nMaxStaffsPerBusiness: number;
    nProductCategories: number;
    nMaxProductsPerBusiness: number;
    nMaxProductCategoriesPerBusiness: number;
    nMaxProductVariantsPerProduct: number;
  } = {
    nCustomers: 5,
    nBusinesses: 2,
    nMaxStaffsPerBusiness: 3,
    nProductCategories: 3,
    nMaxProductsPerBusiness: 3,
    nMaxProductCategoriesPerBusiness: 1,
    nMaxProductVariantsPerProduct: 3,
  },
) {
  const {
    nBusinesses,
    nCustomers,
    nMaxProductsPerBusiness,
    nMaxProductCategoriesPerBusiness,
    nMaxStaffsPerBusiness,
    nMaxProductVariantsPerProduct,
    nProductCategories,
  } = configs;

  const startTime = Date.now();

  // Seed dummy customers user
  await each(
    Array.from({ length: nCustomers }, getDummyUser),
    async (input: CreateUserInput) => {
      await prismaService.user.create({
        data: {
          ...input,
          email: normalizeEmail(input.email) || input.email,
          password: await hash(input.password, BCRYPT_SALT_ROUND),
        },
      });
    },
  );

  // Seed product categories
  const productCategories: ProductCategory[] = [];

  await each(
    Array.from({ length: nProductCategories }, getDummyProductCategory),
    async (category: CreateProductCategoryInput) => {
      const productCategory = await prismaService.productCategory.create({
        data: category,
      });

      productCategories.push(productCategory);
    },
  );

  // Seed dummy businesses

  await each(
    Array.from({ length: nBusinesses }, getDummyBusiness),
    async (input: CreateBusinessInput) => {
      const business = await prismaService.business.create({
        data: {
          ...input,
        },
      });

      // Seed members fo each business
      const nStaff = randomNumber(0, nMaxStaffsPerBusiness - 1);

      // Always seed an owner
      const ownerUser = await prismaService.user.create({
        data: {
          ...getDummyUser(),
          email: normalizeEmail(getDummyUser().email) || getDummyUser().email,
          password: await hash(getDummyUser().password, BCRYPT_SALT_ROUND),
        },
      });

      await prismaService.businessMember.create({
        data: {
          business: {
            connect: {
              id: business.id,
            },
          },
          user: {
            connect: {
              id: ownerUser.id,
            },
          },
          role: BusinessMemberRole.OWNER,
        },
      });

      // Seed staffs
      await each(
        Array.from({ length: nStaff }, getDummyUser),
        async (input: CreateUserInput) => {
          const user = await prismaService.user.create({
            data: {
              ...input,
              email: normalizeEmail(input.email) || input.email,
              password: await hash(input.password, BCRYPT_SALT_ROUND),
            },
          });

          // Create a business member (staff or manager)
          await prismaService.businessMember.create({
            data: {
              business: {
                connect: {
                  id: business.id,
                },
              },
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        },
      );

      // Seed products for each business
      const nProducts = randomNumber(0, nMaxProductsPerBusiness);

      if (nProducts === 0) {
        return;
      }

      const nBusinessCategories = randomNumber(
        1,
        nMaxProductCategoriesPerBusiness,
      );

      const categories = randomElementsFromArray(
        productCategories,
        nBusinessCategories,
      );

      const products = Array.from({ length: nProducts }, () => {
        const randomCategory = randomNumber(0, categories.length - 1);
        const category = categories[randomCategory];
        return getDummyProduct({
          name: category.name,
          productCategoryId: category.id,
          businessId: business.id,
          // The business can supply other brands
          brand: randomNumber(0, 1) === 1 ? business.name : null,
        });
      });

      await each(
        products,
        async ({
          productCategoryId,
          businessId,
          ...input
        }: CreateProductInput) => {
          const product = await prismaService.product.create({
            data: {
              ...input,
              business: {
                connect: {
                  id: businessId,
                },
              },
              productCategory: {
                connect: {
                  id: productCategoryId,
                },
              },
            },
          });

          // For each product, create a random number of product variants
          const nVariants = randomNumber(1, nMaxProductVariantsPerProduct);

          await each(
            Array.from({ length: nVariants }, () =>
              getDummyProductVariant({
                productName: product.name,
                productId: product.id,
              }),
            ),
            async ({ productId, ...input }: CreateProductVariantInput) => {
              await prismaService.productVariant.create({
                data: {
                  ...input,
                  product: {
                    connect: {
                      id: productId,
                    },
                  },
                },
              });
            },
          );
        },
      );
    },
  );

  const endTime = Date.now();

  console.log(
    `Seeder finished in ${(Number(endTime - startTime) / 1000).toPrecision(3)} seconds 🚀`,
  );
}

async function bootstrapSeeder() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    forceCloseConnections: true,
  });

  const prismaService = app.get(PrismaService);

  await seeder(prismaService);
  process.exit(0);
}

bootstrapSeeder();
