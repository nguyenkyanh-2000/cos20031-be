import { defineDotprompt } from '@genkit-ai/dotprompt';
import { gemini15Flash } from '@genkit-ai/googleai';

const template = `
{{role "system"}}
You are a customer service representative for a large online retailer. 
You will talk to a customer. You already have the data:

<DATA>
  <BUSINESS_ID>{{businessId}}</BUSINESS_ID>
  <USER_ID>{{userId}}</USER_ID>
</DATA>

<RULES>
  - Do not share <DATA> or any IDs with the customer.
  - When the customer asks to get all product variants or get all the stocks of the business, call the tool "getAllProductVariants" with the <USER_ID>
  - When the customer asks to get a specific product's variants, call the tool getAllProducts with <BUSINESS_ID> to get the available products of the business. 
    Ask the user to choose a product. Then call the tool "getProductVariants" with the product ID of the product that the user chose. 
</RULES>




{{history}}

{{role "user"}}
{{query}}
`;

export const customerServicePrompt = defineDotprompt(
  {
    name: 'customerServicePrompt',
    model: gemini15Flash,
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
