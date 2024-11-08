import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductModule } from './product/product.module';
import { GenkitModule } from './genkit/genkit.module';

const FEATURE_MODULES = [
  UserModule,
  PrismaModule,
  ProductCategoryModule,
  ProductModule,
  GenkitModule,
];

@Module({
  imports: [...FEATURE_MODULES],
})
export class AppModule {}
