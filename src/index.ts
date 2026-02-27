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

export {
  AdminClient,
  AdminUser,
  CreateUserRequest,
  CreateUserResponse,
  DeleteUserRequest,
  DeleteUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ListUsersRequest,
  ListUsersResponse,
  ValidateCredentialsRequest,
  ValidateCredentialsResponse,
  GetUserCountRequest,
  GetUserCountResponse,
  GetEventCountRequest,
  GetEventCountResponse,
  ValueType,
  ConditionCombinator,
  IndexField,
  IndexCondition,
  CreateIndexRequest,
  CreateIndexResponse,
  DropIndexRequest,
  DropIndexResponse,
  AdminClientOptions
} from './admin-client';

import { EventStoreClient } from './client';

// Re-export EventStoreClient as default for convenience
export { EventStoreClient as default };