import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductCategoryInput } from './product-category.dto';
import { ProductCategory } from '@prisma/client';

@Injectable()
export class ProductCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createProductCategory({
    ...input
  }: CreateProductCategoryInput): Promise<ProductCategory> {
    const logger = new Logger(
      `${this.constructor.name}:${this.createProductCategory.name}`,
    );

    logger.log(`Creating product category: ${input.name}`);

    const { name } = input;

    // Find if product category with the same name exists
    const existingProductCategory = await this.prisma.productCategory.findFirst(
      {
        where: {
          name,
        },
      },
    );

    if (existingProductCategory) {
      logger.warn(
        `Product category already exists: ${existingProductCategory.id}`,
      );
      return existingProductCategory;
    }

    const productCategory = await this.prisma.productCategory.create({
      data: {
        ...input,
      },
    });

    logger.log(`Product category created: ${productCategory.id}`);
    return productCategory;
  }
}
