import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductInput {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsUUID()
  productCategoryId: string;

  @IsUUID()
  supplierId: string;
}
