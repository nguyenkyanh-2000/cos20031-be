import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateProductVariantInput {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  stock: number;

  images: string[];

  @IsUUID()
  productId: string;
}
