import { configureGenkit } from '@genkit-ai/core';
import { googleAI } from '@genkit-ai/googleai';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CustomerServiceFlow } from './customer-service/customer-service.flow';
import { runFlow } from '@genkit-ai/flow';

@Injectable()
export class GenkitService implements OnModuleInit {
  constructor(private customerServiceFlow: CustomerServiceFlow) {}

  async handleCustomerRequest(input: { query: string; history: any }) {
    const logger = new Logger(`${GenkitService.name}::handleCustomerRequest`);
    logger.log(`Received customer request: ${input.query}`);

    return await runFlow(this.customerServiceFlow, {
      query: input.query,
      history: input.history,
    });
  }

  onModuleInit() {
    configureGenkit({
      plugins: [googleAI()],
      // Log debug output to tbe console.
      logLevel: 'info',
      // Perform OpenTelemetry instrumentation and enable trace collection.
      enableTracingAndMetrics: true,
    });
  }
}
