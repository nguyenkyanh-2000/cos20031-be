import { Module } from '@nestjs/common';
import { GenkitService } from './genkit.service';
import { GenkitController } from './genkit.controller';
import { CustomerServiceFlow } from './customer-service/customer-service.flow';
import { GenkitSessionService } from './genkit-session.service';

@Module({
  imports: [],
  controllers: [GenkitController],
  providers: [GenkitService, CustomerServiceFlow, GenkitSessionService],
})
export class GenkitModule {}
