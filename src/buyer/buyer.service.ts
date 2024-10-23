import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBuyerInput } from './buyer.dto';
import { Buyer, User } from '@prisma/client';

@Injectable()
export class BuyerService {
  constructor(private readonly prisma: PrismaService) {}
  async createBuyer({ userId, ...input }: CreateBuyerInput): Promise<
    Buyer & {
      user: User;
    }
  > {
    const logger = new Logger(
      `${this.constructor.name}:${this.createBuyer.name}`,
    );

    // Check if user exists

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.error(`User not found: ${userId}`);
      throw new Error(`User not found: ${userId}`);
    }

    // Check if supplier already exists
    const existingBuyer = await this.prisma.buyer.findFirst({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });

    if (existingBuyer) {
      logger.warn(`Buyer already exists: ${existingBuyer.id}`);
      return existingBuyer;
    }

    const buyer = await this.prisma.buyer.create({
      data: {
        ...input,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return buyer;
  }
}
