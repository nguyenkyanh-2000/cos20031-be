import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBusinessInput } from './business.dto';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async createBusiness({ ...data }: CreateBusinessInput) {
    const logger = new Logger(
      `${this.constructor.name}:${this.createBusiness.name}`,
    );

    const business = await this.prisma.business.create({
      data: {
        ...data,
      },
    });

    logger.log(`Business created: ${business.id}`);

    return business;
  }
}
