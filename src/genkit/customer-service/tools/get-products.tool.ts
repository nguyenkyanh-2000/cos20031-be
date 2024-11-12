import { Injectable } from '@nestjs/common';
import { GenkitTool } from 'src/genkit/interfaces/GenkitTool';
import { ProductService } from 'src/product/product.service';
import { z } from 'zod';

const GetProductsToolInputSchema = z.object({
  businessId: z.string(),
});

const GetProductsToolOutputSchema = z.any();

@Injectable()
export class GetProductsTool extends GenkitTool<
  typeof GetProductsToolInputSchema,
  typeof GetProductsToolOutputSchema
> {
  constructor(private readonly productService: ProductService) {
    super(
      {
        name: 'getAllProduct',
        description:
          'Call this tool when you need to get all products of a business',
        inputSchema: GetProductsToolInputSchema,
        outputSchema: GetProductsToolOutputSchema,
      },
      async (input) => {
        const { businessId } = input;

        const products = await this.productService.getProducts({
          businessId,
        });

        // Select only the necessary fields

        return products.map(({ name, id, description, brand }) => ({
          name,
          id,
          description,
          brand,
        }));
      },
    );
  }
}
