import { PrismaService } from 'src/prisma/prisma.service';
import { getDummyUser } from './user.dummy';
import { each } from 'bluebird';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { normalizeEmail } from 'validator';
import { CreateUserInput } from 'src/user/user.dto';
import { hash } from 'bcrypt';
import { BCRYPT_SALT_ROUND } from 'src/auth/auth.const';

async function seeder(
  prismaService: PrismaService,
  configs: {
    nUsers: number;
  } = {
    nUsers: 100,
  },
) {
  const { nUsers } = configs;

  // Seed dummy users
  const dummyUsers = Array.from({ length: nUsers }, getDummyUser);

  await each(dummyUsers, async (user: CreateUserInput) => {
    await prismaService.user.create({
      data: {
        ...user,
        normalizedEmail: normalizeEmail(user.email) || user.email,
        password: await hash(user.password, BCRYPT_SALT_ROUND),
      },
    });
  });
}

async function bootstrapSeeder() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    forceCloseConnections: true,
  });

  const prismaService = app.get(PrismaService);

  await seeder(prismaService);
  process.exit(0);
}

bootstrapSeeder();
