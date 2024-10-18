import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Buyer, Prisma, Supplier, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from 'src/auth/auth.const';
import { normalizeEmail } from 'validator';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser({ password, ...data }: Prisma.UserCreateInput): Promise<
    User & {
      supplier: Supplier | null;
      buyer: Buyer | null;
    }
  > {
    const logger = new Logger(
      `${this.constructor.name}:${this.createUser.name}`,
    );

    // Search for existing user

    let user = await this.prisma.user.findFirst({
      where: {
        normalizedEmail: normalizeEmail(data.email) || data.email,
      },
      include: {
        supplier: true,
        buyer: true,
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
      include: {
        supplier: true,
        buyer: true,
      },
    });

    logger.log(`User created: ${user.id}`);

    return user;
  }
}
