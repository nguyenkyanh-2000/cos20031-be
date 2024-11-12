import { Module } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';

@Module({
  exports: [ProductVariantService],
  providers: [ProductVariantService],
  controllers: [ProductVariantController],
})
export class ProductVariantModule {}
