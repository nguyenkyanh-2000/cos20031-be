import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from 'src/core/auth/auth.const';
import { normalizeEmail } from 'validator';
import { CreateUserInput, GetUserByIdParams } from './user.dto';
import {
  PaginationMetadata,
  PaginationOptions,
} from 'src/core/pagination/pagination.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser({ password, ...data }: CreateUserInput): Promise<User> {
    const logger = new Logger(
      `${this.constructor.name}:${this.createUser.name}`,
    );

    // Search for existing user

    let user = await this.prisma.user.findFirst({
      where: {
        normalizedEmail: normalizeEmail(data.email) || data.email,
      },
    });

    if (user) {
      logger.warn(`User already exists: ${user.id}`);

      return user;
    }

    user = await this.prisma.user.create({
      data: {
        ...data,
        normalizedEmail: normalizeEmail(data.email) || data.email,
        password: await hash(password, BCRYPT_SALT_ROUND),
      },
    });

    logger.log(`User created: ${user.id}`);

    return user;
  }

  async getUserById(params: GetUserByIdParams): Promise<User> {
    const { userId } = params;

    const logger = new Logger(
      `${this.constructor.name}:${this.getUserById.name}`,
    );

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.warn(`User not found: ${userId}`);
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUsers({
    paginationOptions,
  }: {
    paginationOptions: PaginationOptions;
  }) {
    const { limit, skip } = paginationOptions;

    const [total, users] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.user.findMany({
        take: limit,
        skip,
      }),
    ]);

    return {
      users,
      metadata: new PaginationMetadata({
        paginationOptions,
        total,
      }),
    };
  }
}
