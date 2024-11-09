import { Body, Controller, Post } from '@nestjs/common';
import { GenkitService } from './genkit.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('genkit')
@Controller('genkit')
export class GenkitController {
  constructor(private readonly genkitService: GenkitService) {}

  @Post('customer-service')
  async handleCustomerService(@Body() body: { query: string; userId: string }) {
    const { query, userId } = body;
    return await this.genkitService.handleCustomerRequest({
      query,
      userId,
    });
  }
}
