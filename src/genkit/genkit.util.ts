import { MessageData } from '@genkit-ai/ai/model';
import { AIChatHistoryItem } from '@prisma/client';

export const convertHistoryItemToMessageData = (
  historyItem: AIChatHistoryItem,
): MessageData => {
  return {
    role: historyItem.role.toLowerCase(),
    content: historyItem.content,
  } as MessageData;
};
