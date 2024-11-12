import { MessageData } from '@genkit-ai/ai/model';
import { Injectable, Logger } from '@nestjs/common';
import {
  AIChatHistoryItem,
  AIChatSessionStatus,
  AIChatSessionType,
  HistoryItemRole,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { convertHistoryItemToMessageData } from './genkit.util';
import { AIChatSessionResponseType } from './genkit.const';

@Injectable()
export class GenkitSessionService {
  constructor(private readonly prisma: PrismaService) {
    // Initialize the Genkit AI session.
  }

  /** Find in-progress chat session by user id and return type */
  async findInProgressChatSessionByUserId(
    userId: string,
    type: AIChatSessionType,
  ) {
    const inProgressChatSession = await this.prisma.aIChatSession.findFirst({
      where: {
        userId,
        status: AIChatSessionStatus.IN_PROGRESS,
        type,
      },
    });

    return inProgressChatSession;
  }

  /** Append an item to chat session history in db.
   * If the session does not exist, create a new session.
   * Default session type is IN_PROGRESS so it will find the first in-progress session.
   */
  async appendChatSessionHistoryInDb(
    userId: string,
    type: AIChatSessionType,
    data: MessageData,
    status: AIChatSessionStatus = AIChatSessionStatus.IN_PROGRESS,
  ) {
    let session = await this.prisma.aIChatSession.findFirst({
      where: {
        userId,
        type,
        status,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!session) {
      session = await this.createChatSession({ userId, type });
    }

    await this.prisma.aIChatHistoryItem.create({
      data: {
        chatSessionId: session.id,
        role: data.role.toUpperCase() as HistoryItemRole,
        content: data.content as any[],
      },
    });
  }

  /** Create a chat session */
  async createChatSession(input: {
    metadata?: Record<string, string | string[]>;
    type: AIChatSessionType;
    userId: string;
  }) {
    const logger = new Logger(
      `${GenkitSessionService.name}:${this.createChatSession.name}`,
    );

    const { metadata, userId, type } = input;

    logger.log(`Creating AI chat session for user ${userId}`);

    const session = await this.prisma.aIChatSession.create({
      data: {
        metadata,
        userId,
        type,
      },
    });

    logger.log(`Created AI chat session with ID ${session.id}`);

    return session;
  }

  /** Finish a chat session */
  async finishChatSession(userId: string, type: AIChatSessionType) {
    const logger = new Logger(
      `${GenkitSessionService.name}:${this.finishChatSession.name}`,
    );

    logger.log(`Finishing AI chat session of user ${userId} type ${type}`);

    const chatSession = await this.prisma.aIChatSession.findFirst({
      where: {
        userId,
        type,
        status: AIChatSessionStatus.IN_PROGRESS,
      },
    });

    if (!chatSession) {
      logger.error(`AI chat session of user ${userId} type ${type} not found`);
      return;
    }

    await this.prisma.aIChatSession.update({
      where: {
        id: chatSession.id,
      },
      data: {
        status: AIChatSessionStatus.FINISHED,
      },
    });

    logger.log(`Finished AI chat session ${chatSession.id}`);
  }

  /**
   * Get the history of the in-progress chat session
   * by user id and type
   * @returns The history of the in-progress chat session or null if there is no in-progress chat session
   */
  async getInProgressChatSessionHistory(input: {
    type: AIChatSessionType;
    userId: string;
    responseType?: AIChatSessionResponseType;
  }): Promise<MessageData[] | null | AIChatHistoryItem[]> {
    const {
      userId,
      type,
      responseType = AIChatSessionResponseType.MESSAGE_DATA,
    } = input;

    const dbSession = await this.prisma.aIChatSession.findFirst({
      where: {
        userId,
        type,
        status: AIChatSessionStatus.IN_PROGRESS,
      },
      include: {
        history: true,
      },
    });

    if (responseType === AIChatSessionResponseType.AI_CHAT_HISTORY_ITEM) {
      return dbSession ? dbSession.history : null;
    }

    return dbSession
      ? dbSession.history.map(convertHistoryItemToMessageData)
      : null;
  }
}
