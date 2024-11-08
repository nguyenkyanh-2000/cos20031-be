import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBusinessMemberInput } from './business-member.dto';

@Injectable()
export class BusinessMemberService {
  constructor(private readonly prisma: PrismaService) {}

  async createBusinessMember({
    userId,
    businessId,
    ...input
  }: CreateBusinessMemberInput) {
    const logger = new Logger(
      `${this.constructor.name}:${this.createBusinessMember.name}`,
    );

    // Check if the user exists
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      logger.error(`User not found: ${userId}`);
      throw new BadRequestException('User not found');
    }

    // Check if the business exists
    const business = await this.prisma.business.findUnique({
      where: {
        id: businessId,
      },
    });

    if (!business) {
      logger.error(`Business not found: ${businessId}`);
      throw new BadRequestException('Business not found');
    }

    // Check if the user is already a member of the business
    const existingBusinessMember = await this.prisma.businessMember.findFirst({
      where: {
        userId,
        businessId,
      },
    });

    if (existingBusinessMember) {
      logger.warn(
        `User ${userId} is already a member of the business ${businessId}`,
      );

      return existingBusinessMember;
    }

    const businessMember = await this.prisma.businessMember.create({
      data: {
        ...input,
        user: {
          connect: {
            id: userId,
          },
        },
        business: {
          connect: {
            id: businessId,
          },
        },
      },
    });

    logger.log(`Business member created: ${businessMember.id}`);

    return businessMember;
  }
}
