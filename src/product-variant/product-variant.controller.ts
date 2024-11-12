import { Controller, Get, Query } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('product-variant')
@ApiTags('product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Get()
  async getProductVariants(
    @Query('businessId') businessId: string,
    @Query('stockLowerBound') stockLowerBound?: number,
    @Query('stockUpperBound') stockUpperBound?: number,
    @Query('priceLowerBound') priceLowerBound?: number,
    @Query('priceUpperBound') priceUpperBound?: number,
  ) {
    return await this.productVariantService.getAllProductVariants({
      businessId,
      stockLowerBound,
      stockUpperBound,
      priceLowerBound,
      priceUpperBound,
    });
  }
}
