import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { SupplierModule } from './supplier/supplier.module';

const FEATURE_MODULES = [UserModule, PrismaModule, SupplierModule];

@Module({
  imports: [...FEATURE_MODULES],
})
export class AppModule {}
