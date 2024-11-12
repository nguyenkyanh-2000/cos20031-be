import { Injectable } from '@nestjs/common';
import { GenkitTool } from 'src/genkit/interfaces/GenkitTool';
import { ProductVariantService } from 'src/product-variant/product-variant.service';
import { z } from 'zod';

const GetProductVariantsToolInputSchema = z.object({
  productId: z.string(),
});

const GetProductVariantsToolOutputSchema = z.any();

@Injectable()
export class GetProductVariantsTool extends GenkitTool<
  typeof GetProductVariantsToolInputSchema,
  typeof GetProductVariantsToolOutputSchema
> {
  constructor(private readonly productVariantService: ProductVariantService) {
    super(
      {
        name: 'getProductsVariants',
        description:
          'Call this tool when you need to get all product variants of a product.',
        inputSchema: GetProductVariantsToolInputSchema,
        outputSchema: GetProductVariantsToolOutputSchema,
      },
      async (input) => {
        const { productId } = input;

        const productVariants =
          await this.productVariantService.getProductVariants(productId);

        // Select only the necessary fields

        return productVariants.map(({ name, stock, price }) => ({
          name,
          stock,
          price,
        }));
      },
    );
  }
}
