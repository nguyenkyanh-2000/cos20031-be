import { Module } from '@nestjs/common';
import { GenkitService } from './genkit.service';
import { GenkitController } from './genkit.controller';
import { CustomerServiceFlow } from './customer-service/customer-service.flow';

@Module({
  imports: [],
  controllers: [GenkitController],
  providers: [GenkitService, CustomerServiceFlow],
})
export class GenkitModule {}
