import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupplierInput } from './supplier.dto';
import { Supplier, User } from '@prisma/client';

@Injectable()
export class SupplierService {
  constructor(private readonly prisma: PrismaService) {}

  async createSupplier({ userId, ...input }: CreateSupplierInput): Promise<
    Supplier & {
      user: User;
    }
  > {
    const logger = new Logger(
      `${this.constructor.name}:${this.createSupplier.name}`,
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
    const existingSupplier = await this.prisma.supplier.findFirst({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });

    if (existingSupplier) {
      logger.warn(`Supplier already exists: ${existingSupplier.id}`);
      return existingSupplier;
    }

    const supplier = await this.prisma.supplier.create({
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

    return supplier;
  }
}
