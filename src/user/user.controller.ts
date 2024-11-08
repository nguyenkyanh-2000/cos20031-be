import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserInput,
  GetUserByIdParams,
  GetUsersOutput,
  UserOutput,
} from './user.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiErrorResponse,
  ApiGetResponse,
  ApiPostResponse,
} from 'src/core/decorators/api-response.decorator';
import { PaginationOptions } from 'src/core/pagination/pagination.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiPostResponse(UserOutput, 'User created successfully')
  @ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'One of the inputs is invalid')
  async createUser(@Body() input: CreateUserInput) {
    const user = await this.userService.createUser(input);
    return new UserOutput(user);
  }

  @Get('/:userId')
  @ApiGetResponse(UserOutput, 'User retrieved successfully')
  @ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'The user ID is invalid')
  async getUserById(@Param() params: GetUserByIdParams) {
    const user = await this.userService.getUserById(params);
    return new UserOutput(user);
  }

  @Get()
  @ApiGetResponse(GetUsersOutput, 'Users retrieved successfully')
  @ApiErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'One of the inputs is invalid')
  async getUsers(@Query() paginationOptions: PaginationOptions) {
    const { users, metadata } = await this.userService.getUsers({
      paginationOptions,
    });

    return {
      users: users.map((user) => new UserOutput(user)),
      metadata,
    };
  }
}
