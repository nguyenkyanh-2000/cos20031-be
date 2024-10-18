import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './user.dto';
import { ResponseMessage } from 'src/decorators/response-message.decorators';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ResponseMessage('User created successfully')
  async createUser(@Body() input: CreateUserInput) {
    return await this.userService.createUser(input);
  }
}
