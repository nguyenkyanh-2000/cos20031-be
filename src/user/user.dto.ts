import { ApiHideProperty } from '@nestjs/swagger';
import { $Enums, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationMetadata } from 'src/core/pagination/pagination.dto';

export class CreateUserInput {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;
}

export class UserOutput implements User {
  @Exclude()
  @ApiHideProperty()
  id: string;

  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date;

  email: string;

  @Exclude()
  @ApiHideProperty()
  password: string;

  normalizedEmail: string;

  @Exclude()
  @ApiHideProperty()
  role: $Enums.UserRole;

  constructor(partial: Partial<UserOutput>) {
    Object.assign(this, partial);
  }

  name: string;

  phone: string;

  address: string;
}

export class GetUserByIdParams {
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class GetUsersOutput {
  users: UserOutput[];

  metadata: PaginationMetadata;
}
