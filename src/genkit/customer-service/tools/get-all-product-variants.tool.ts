import { Injectable } from '@nestjs/common';
import { GenkitTool } from 'src/genkit/interfaces/GenkitTool';
import { ProductVariantService } from 'src/product-variant/product-variant.service';
import { z } from 'zod';

const GetAllProductVariantsToolInputSchema = z.object({
  businessId: z.string(),
});

const GetAllProductVariantsToolOutputSchema = z.any();

@Injectable()
export class GetAllProductVariantsTool extends GenkitTool<
  typeof GetAllProductVariantsToolInputSchema,
  typeof GetAllProductVariantsToolOutputSchema
> {
  constructor(private readonly productVariantService: ProductVariantService) {
    super(
      {
        name: 'getAllProductVariants',
        description:
          'Call this tool when you need to get all products and products variants of a business',
        inputSchema: GetAllProductVariantsToolInputSchema,
        outputSchema: GetAllProductVariantsToolOutputSchema,
      },
      async (input) => {
        const { businessId } = input;

        const productVariants =
          await this.productVariantService.getAllProductVariants({
            businessId,
          });

        // Select only the necessary fields

        return productVariants.map(({ name, stock, price, product }) => ({
          name,
          stock,
          price,
          productName: product.name,
          brand: product.brand,
        }));
      },
    );
  }
}
