import { configureGenkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CustomerServiceFlow } from './customer-service/customer-service.flow';
import { runFlow } from '@genkit-ai/flow';
import { GenkitSessionService } from './genkit-session.service';
import { AIChatSessionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GenkitService implements OnModuleInit {
  constructor(
    private customerServiceFlow: CustomerServiceFlow,
    private genkitSessionService: GenkitSessionService,
    private prisma: PrismaService,
  ) {}

  async handleCustomerRequest(input: { query: string; userId: string }) {
    const { query, userId } = input;

    const logger = new Logger(`${GenkitService.name}::handleCustomerRequest`);
    logger.log(`Received customer request: ${query}`);

    // Find the history of in-progress chat session
    const history =
      await this.genkitSessionService.getInProgressChatSessionHistory({
        userId,
        type: AIChatSessionType.CUSTOMER_SERVICE,
      });

    // If there is no in-progress chat session, create a new chat session
    if (history === null) {
      await this.genkitSessionService.createChatSession({
        userId,
        type: AIChatSessionType.CUSTOMER_SERVICE,
      });
    }

    // Find the business that the user is a member of
    const business = await this.prisma.business.findFirst({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });

    return await runFlow(this.customerServiceFlow, {
      query,
      // System message not supported in flow
      history: history?.filter((item) => item.role !== 'system') || [],
      userId,
      businessId: business ? business.id : '',
    });
  }

  onModuleInit() {
    configureGenkit({
      plugins: [googleAI()],
      // Log debug output to tbe console.
      logLevel: 'info',
    });
  }
}
