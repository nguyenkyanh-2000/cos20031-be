import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductInput } from './product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct({
    businessId,
    productCategoryId,
    ...input
  }: CreateProductInput): Promise<Product> {
    const logger = new Logger(
      `${this.constructor.name}:${this.createProduct.name}`,
    );

    logger.log(`Creating product: ${input.name}`);

    // Check if business exists
    const business = await this.prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!business) {
      logger.error(`Business not found: ${businessId}`);
      throw new Error(`Business not found: ${businessId}`);
    }

    // Check if product category exists
    const productCategory = await this.prisma.productCategory.findUnique({
      where: {
        id: productCategoryId,
      },
    });

    if (!productCategory) {
      logger.error(`Product category not found: ${productCategoryId}`);
      throw new Error(`Product category not found: ${productCategoryId}`);
    }

    // Create the product

    const product = await this.prisma.product.create({
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

    return product;
  }

  async getProducts({
    businessId,
  }: {
    businessId: string;
  }): Promise<Product[]> {
    const logger = new Logger(
      `${this.constructor.name}:${this.getProducts.name}`,
    );

    logger.log(`Getting available products for business ${businessId}`);

    const products = await this.prisma.product.findMany({
      where: {
        businessId,
      },
      include: {
        productCategory: true,
      },
    });

    return products;
  }
}
