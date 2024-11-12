import { Module } from '@nestjs/common';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  exports: [ProductService],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
