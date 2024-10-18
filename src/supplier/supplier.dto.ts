import { IsEmail, IsNotEmpty, IsPhoneNumber, IsUUID } from 'class-validator';

export class CreateSupplierInput {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
