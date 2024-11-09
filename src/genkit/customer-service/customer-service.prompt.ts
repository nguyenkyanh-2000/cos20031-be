import { defineDotprompt } from '@genkit-ai/dotprompt';
import { gemini15Flash8B } from '@genkit-ai/googleai';

const template = `
{{role "system"}}
You are a customer service representative for a large online retailer.


{{history}}

{{role "user"}}
{{query}}
`;

export const customerServicePrompt = defineDotprompt(
  {
    name: 'customerServicePrompt',
    model: gemini15Flash8B,
    config: {
      temperature: 0.3,
      topK: 32,
      topP: 0.9,
      safetySettings: [
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_ONLY_HIGH',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
      ],
    },
  },
  template,
);
