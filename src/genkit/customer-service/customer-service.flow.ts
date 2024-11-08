import { Injectable } from '@nestjs/common';
import { GenkitFlow } from '../interfaces/GenkitFlow';
import { defineFlow, Flow } from '@genkit-ai/flow';
import { customerServicePrompt } from './customer-service.prompt';
import { z } from 'zod';

export const customerServiceFlowInputSchema = z.object({
  query: z.string(),
  history: z.any(),
});

@Injectable()
export class CustomerServiceFlow implements GenkitFlow {
  flow: Flow;

  constructor() {
    this.flow = defineFlow(
      {
        name: 'customerServiceFlow',
        inputSchema: customerServiceFlowInputSchema,
      },
      async (input) => {
        const res = await customerServicePrompt.generate({
          input,
          output: {
            format: 'text',
          },
        });

        const answer = res.text();
        const newHistory = res.toHistory();

        return {
          answer,
          history: newHistory,
        };
      },
    );
  }
}
