import { defineTool, ToolAction } from '@genkit-ai/ai';
import z__default from 'zod';

export class GenkitTool<
  I extends z__default.ZodTypeAny = z__default.ZodTypeAny,
  O extends z__default.ZodTypeAny = z__default.ZodTypeAny,
> {
  name: string;

  tool: ToolAction<I, O>;

  constructor(
    data: {
      description: string;
      inputSchema: I;
      name: string;
      outputSchema: O;
    },
    fn: (input: z__default.infer<I>) => Promise<z__default.infer<O>>,
  ) {
    this.tool = defineTool(data, fn);
    this.name = data.name;
  }
}
