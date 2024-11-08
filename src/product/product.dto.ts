import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductInput {
  brand: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsUUID()
  productCategoryId: string;

  @IsUUID()
  businessId: string;
}
