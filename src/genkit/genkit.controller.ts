import { Body, Controller, Post, Res } from '@nestjs/common';
import { GenkitService } from './genkit.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('genkit')
@Controller('genkit')
export class GenkitController {
  constructor(private readonly genkitService: GenkitService) {}

  @Post('customer-service')
  async handleCustomerService(@Body() body: any) {
    return await this.genkitService.handleCustomerRequest({
      query: body.query,
      history: body.history,
    });
  }
}
