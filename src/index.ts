export {
  EventStoreClient,
  Event,
  EventToSave,
  SaveEventsRequest,
  GetEventsRequest,
  SubscribeRequest,
  Position,
  Tag,
  Criterion,
  Query,
  EventStoreClientOptions,
  Logger
} from './client';

import { EventStoreClient } from './client';

// Re-export for convenience
export default EventStoreClient;