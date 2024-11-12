import { Module } from '@nestjs/common';
import { GenkitService } from './genkit.service';
import { GenkitController } from './genkit.controller';
import { CustomerServiceFlow } from './customer-service/customer-service.flow';
import { GenkitSessionService } from './genkit-session.service';
import { ProductVariantModule } from 'src/product-variant/product-variant.module';
import { GetAllProductVariantsTool } from './customer-service/tools/get-all-product-variants.tool';
import { GetProductVariantsTool } from './customer-service/tools/get-product-variants.tool';
import { GetProductsTool } from './customer-service/tools/get-products.tool';
import { ProductModule } from 'src/product/product.module';

const tools = [
  GetAllProductVariantsTool,
  GetProductVariantsTool,
  GetProductsTool,
];
@Module({
  imports: [ProductVariantModule, ProductModule],
  controllers: [GenkitController],
  providers: [
    GenkitService,
    CustomerServiceFlow,
    GenkitSessionService,
    ...tools,
  ],
})
export class GenkitModule {}
