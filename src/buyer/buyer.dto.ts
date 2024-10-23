import { IsNotEmpty, IsOptional, IsPhoneNumber, IsUUID } from 'class-validator';

export class CreateBuyerInput {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  address: string;

  @IsOptional()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
