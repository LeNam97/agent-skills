export interface QueueMessage<T = unknown> {
  topic: string;
  payload: T;
}

export class QueueService {
  async publish<T>(message: QueueMessage<T>): Promise<void> {
    void message;
  }
}
