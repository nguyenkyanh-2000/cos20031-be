import { Injectable } from '@nestjs/common';
import { GenkitFlow } from '../interfaces/GenkitFlow';
import { defineFlow, Flow } from '@genkit-ai/flow';
import { customerServicePrompt } from './customer-service.prompt';
import { z } from 'zod';
import { MessageData } from '@genkit-ai/ai/model';
import { GenkitSessionService } from '../genkit-session.service';
import { AIChatSessionStatus, AIChatSessionType } from '@prisma/client';
import { each } from 'bluebird';

export const customerServiceFlowInputSchema = z.object({
  query: z.string(),
  history: z.any(),
  userId: z.string(),
});

@Injectable()
export class CustomerServiceFlow implements GenkitFlow {
  flow: Flow;

  constructor(private readonly genkitSessionService: GenkitSessionService) {
    this.flow = defineFlow(
      {
        name: 'customerServiceFlow',
        inputSchema: customerServiceFlowInputSchema,
      },
      async (input) => {
        const { history, userId } = input;

        const llmResponse = await customerServicePrompt.generate({
          input,
          history,
          output: {
            format: 'text',
          },
        });

        const oldHistory = history;
        const newHistory: MessageData[] = llmResponse.toHistory();
        const newHistoryItems = newHistory.slice(
          // +1 because old history excludes system message
          oldHistory.length === 0 ? 0 : oldHistory.length + 1,
          newHistory.length,
        );
        const answer = llmResponse.text();

        const chatSession =
          await this.genkitSessionService.getInProgressChatSessionHistory({
            userId,
            type: AIChatSessionType.CUSTOMER_SERVICE,
          });

        // If there is no in progress session, append the last message to the history of the most recent finished session
        if (!chatSession) {
          await each(newHistoryItems, async (item) => {
            await this.genkitSessionService.appendChatSessionHistoryInDb(
              userId,
              AIChatSessionType.CUSTOMER_SERVICE,
              item,
              AIChatSessionStatus.FINISHED,
            );
          });

          return {
            answer,
            history: [],
          };
        }

        each(newHistoryItems, async (item) => {
          await this.genkitSessionService.appendChatSessionHistoryInDb(
            userId,
            AIChatSessionType.CUSTOMER_SERVICE,
            item,
          );
        });

        return {
          answer,
          history: newHistory,
        };
      },
    );
  }
}
