export {
  EventStoreClient,
  Event,
  EventToSave,
  SaveEventsRequest,
  GetEventsRequest,
  SubscribeRequest,
  WriteResult,
  Position,
  EventStoreClientOptions,
  Logger
} from './client';

import { EventStoreClient } from './client';

// Re-export for convenience
export default EventStoreClient;