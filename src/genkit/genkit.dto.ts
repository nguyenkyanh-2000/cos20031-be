import { AIChatHistoryItem } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenkitSessionInput {
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export enum GenkitHistoryItemRole {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
  MODEL = 'MODEL',
  TOOL = 'TOOL',
}

export class GenkitHistoryItem implements AIChatHistoryItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  chatSessionId: string;
  role: GenkitHistoryItemRole;
  content: JsonValue[];
}

export class GenkitSessionOutput {
  answer: string;
  history: GenkitHistoryItem[];
}

export class GenkitSessionHistoryOutput {
  history: GenkitHistoryItem[];
}
