import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductVariantService {
  constructor(private readonly prisma: PrismaService) {
    // Initialize the ProductVariantService.
  }

  async getAllProductVariants({
    businessId,
    stockLowerBound,
    stockUpperBound,
    priceLowerBound,
    priceUpperBound,
  }: {
    businessId: string;
    stockLowerBound?: number;
    priceLowerBound?: number;
    priceUpperBound?: number;
    stockUpperBound?: number;
  }) {
    const logger = new Logger(
      `${this.constructor.name}:${this.getAllProductVariants.name}`,
    );

    logger.log(`Getting  product variants for business ${businessId}`);

    // Find if the business exists
    const business = await this.prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!business) {
      logger.error(`Business not found: ${businessId}`);
      throw new BadRequestException('Business not found');
    }

    // Find all products of the business
    const products = await this.prisma.product.findMany({
      where: {
        businessId,
      },
    });

    // Find all product variants of the products with stock range and price range
    const productVariants = await this.prisma.productVariant.findMany({
      where: {
        productId: {
          in: products.map((product) => product.id),
        },
        stock: {
          ...(stockLowerBound ? { gte: stockLowerBound } : {}),
          ...(stockUpperBound ? { lte: stockUpperBound } : {}),
        },
        price: {
          ...(priceLowerBound ? { gte: priceLowerBound } : {}),
          ...(priceUpperBound ? { lte: priceUpperBound } : {}),
        },
      },
      include: {
        product: true,
      },
    });

    return productVariants;
  }

  async getProductVariants(productId: string) {
    const logger = new Logger(
      `${this.constructor.name}:${this.getProductVariants.name}`,
    );

    logger.log(`Getting stock for product ${productId}`);

    // Find if the product exists
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      logger.error(`Product not found: ${productId}`);
      throw new BadRequestException('Product not found');
    }

    // Find all product variants of the product
    const productVariants = await this.prisma.productVariant.findMany({
      where: {
        productId,
      },
    });

    // Return stock for each product variant
    return productVariants;
  }
}
