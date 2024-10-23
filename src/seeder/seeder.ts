import { PrismaService } from 'src/prisma/prisma.service';
import { getDummyUser } from './user.dummy';
import { each } from 'bluebird';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { normalizeEmail } from 'validator';
import { CreateUserInput } from 'src/user/user.dto';
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from 'src/auth/auth.const';
import { getDummySupplier } from './supplier.dummy';
import { getDummyBuyer } from './buyer.dummy';
import { CreateProductCategoryInput } from 'src/product-category/product-category.dto';
import { getDummyProductCategory } from './product-category.dummy';
import { ProductCategory } from '@prisma/client';
import { getDummyProduct } from './product.dummy';
import { CreateProductInput } from 'src/product/product.dto';

const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomElementsFromArray = <T>(arr: T[], n: number): T[] => {
  return arr.sort(() => 0.5 - Math.random()).slice(0, n);
};

async function seeder(
  prismaService: PrismaService,
  configs: {
    nSuppliers: number;
    nBuyers: number;
    nCategories: number;
    nMaxProductsPerSupplier?: number;
    nMaxProductCategoriesPerSupplier?: number;
  } = {
    nSuppliers: 50,
    nBuyers: 50,
    nCategories: 10,
    nMaxProductCategoriesPerSupplier: 3,
    nMaxProductsPerSupplier: 10,
  },
) {
  const {
    nSuppliers,
    nBuyers,
    nCategories,
    nMaxProductCategoriesPerSupplier,
    nMaxProductsPerSupplier,
  } = configs;

  // Seed dummy buyers
  await each(
    Array.from({ length: nBuyers }, getDummyUser),
    async (user: CreateUserInput) => {
      const dummyUser = await prismaService.user.create({
        data: {
          ...user,
          normalizedEmail: normalizeEmail(user.email) || user.email,
          password: await hash(user.password, BCRYPT_SALT_ROUND),
        },
      });

      const { userId, ...input } = getDummyBuyer(dummyUser.id);

      await prismaService.buyer.create({
        data: {
          ...input,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    },
  );

  // Seed product categories
  const productCategories: ProductCategory[] = [];

  await each(
    Array.from({ length: nCategories }, getDummyProductCategory),
    async (category: CreateProductCategoryInput) => {
      const productCategory = await prismaService.productCategory.create({
        data: category,
      });

      productCategories.push(productCategory);
    },
  );

  // Seed dummy suppliers.

  await each(
    Array.from({ length: nSuppliers }, getDummyUser),
    async (user: CreateUserInput) => {
      const dummyUser = await prismaService.user.create({
        data: {
          ...user,
          normalizedEmail: normalizeEmail(user.email) || user.email,
          password: await hash(user.password, BCRYPT_SALT_ROUND),
        },
      });

      const { userId, ...input } = getDummySupplier(dummyUser.id);

      const supplier = await prismaService.supplier.create({
        data: {
          ...input,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      // Seed products for each supplier
      const nProducts = randomNumber(0, nMaxProductsPerSupplier);

      if (nProducts === 0) {
        return;
      }

      const nCategories = randomNumber(1, nMaxProductCategoriesPerSupplier);

      const categories = randomElementsFromArray(
        productCategories,
        nCategories,
      );

      const products = Array.from({ length: nProducts }, () => {
        const category = categories[randomNumber(0, nCategories - 1)];
        return getDummyProduct({
          name: category.name,
          productCategoryId: category.id,
          supplierId: supplier.id,
        });
      });

      await each(
        products,
        async ({
          productCategoryId,
          supplierId,
          ...input
        }: CreateProductInput) => {
          await prismaService.product.create({
            data: {
              ...input,
              supplier: {
                connect: {
                  id: supplierId,
                },
              },
              productCategory: {
                connect: {
                  id: productCategoryId,
                },
              },
            },
          });
        },
      );
    },
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
