import { BusinessMemberRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateBusinessMemberInput {
  @IsNotEmpty()
  @IsEnum(BusinessMemberRole)
  role: BusinessMemberRole;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  businessId: string;
}
