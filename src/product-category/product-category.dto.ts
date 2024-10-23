import { IsNotEmpty } from 'class-validator';

export class CreateProductCategoryInput {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;
}
