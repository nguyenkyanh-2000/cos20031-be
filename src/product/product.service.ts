import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductInput } from './product.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct({
    supplierId,
    productCategoryId,
    ...input
  }: CreateProductInput): Promise<Product> {
    const logger = new Logger(
      `${this.constructor.name}:${this.createProduct.name}`,
    );

    logger.log(`Creating product: ${input.name}`);

    // Check if supplier exists
    const supplier = await this.prisma.supplier.findUnique({
      where: {
        id: supplierId,
      },
    });

    if (!supplier) {
      logger.error(`Supplier not found: ${supplierId}`);
      throw new Error(`Supplier not found: ${supplierId}`);
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

    return product;
  }
}
