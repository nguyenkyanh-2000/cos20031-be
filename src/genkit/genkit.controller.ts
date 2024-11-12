import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { GenkitService } from './genkit.service';
import { ApiTags } from '@nestjs/swagger';
import {
  GenkitSessionHistoryOutput,
  GenkitSessionInput,
  GenkitSessionOutput,
} from './genkit.dto';
import {
  ApiGetResponse,
  ApiPostResponse,
} from 'src/core/decorators/api-response.decorator';
import { GenkitSessionService } from './genkit-session.service';
import { AIChatSessionType } from '@prisma/client';
import { AIChatSessionResponseType } from './genkit.const';

@ApiTags('genkit')
@Controller('genkit')
export class GenkitController {
  constructor(
    private readonly genkitService: GenkitService,
    private readonly genkitSessionService: GenkitSessionService,
  ) {}

  @Post('customer-service')
  @ApiPostResponse(
    GenkitSessionOutput,
    'Customer service chat session handled successfully',
  )
  async handleCustomerService(@Body() body: GenkitSessionInput) {
    const { query, userId } = body;
    const res: GenkitSessionOutput =
      await this.genkitService.handleCustomerRequest({
        query,
        userId,
      });

    return res;
  }

  @Get('customer-service/:userId')
  @ApiGetResponse(
    GenkitSessionHistoryOutput,
    'Customer service chat session history retrieved successfully',
  )
  async getCustomerServiceChatSessionHistory(@Param('userId') userId: string) {
    const history =
      await this.genkitSessionService.getInProgressChatSessionHistory({
        userId,
        type: AIChatSessionType.CUSTOMER_SERVICE,
        responseType: AIChatSessionResponseType.AI_CHAT_HISTORY_ITEM,
      });

    return { history };
  }

  @Get('customer-service/:userId/finish')
  async finishCustomerServiceChatSession(@Param('userId') userId: string) {
    await this.genkitSessionService.finishChatSession(
      userId,
      AIChatSessionType.CUSTOMER_SERVICE,
    );

    return 'Chat session finished';
  }
}
