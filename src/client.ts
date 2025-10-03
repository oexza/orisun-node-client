import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { promisify } from 'util';
import * as path from 'path';
import * as pb from './generated/eventstore_pb';

// Client-friendly interfaces that match the expected API
export interface Event {
  eventId: string;
  eventType: string;
  data: any;
  metadata?: Record<string, string>;
  streamId: string;
  version: number;
  position: Position;
  dateCreated: string;
}

export interface EventToSave {
  eventId: string;
  eventType: string;
  data: any;
  metadata?: Record<string, string>;
}

export interface Position {
  commitPosition: number;
  preparePosition: number;
}

export interface Tag {
  key: string;
  value: string;
}

export interface Criterion {
  tags: Tag[];
}

export interface Query {
  criteria: Criterion[];
}

export interface SaveEventsRequest {
  boundary: string;
  stream: {
    name: string;
    expectedVersion: number;
    subsetQuery?: Query;
  };
  events: EventToSave[];
}

export interface GetEventsRequest {
  query?: Query;
  fromPosition?: Position;
  count?: number;
  direction?: 'ASC' | 'DESC';
  boundary: string;
  stream?: {
    name: string;
    fromVersion?: number;
  };
}

export interface SubscribeRequest {
  afterPosition?: Position;
  query?: Query;
  subscriberName: string;
  boundary: string;
  stream?: string;
  afterVersion?: number;
}

export interface WriteResult {
  logPosition: Position;
  newStreamVersion: number;
}

// Re-export generated protobuf types for internal use
export type PbEvent = pb.Event;
export type PbEventToSave = pb.EventToSave;
export type PbPosition = pb.Position;
export type PbSaveEventsRequest = pb.SaveEventsRequest;
export type PbGetEventsRequest = pb.GetEventsRequest;
export type PbWriteResult = pb.WriteResult;
export type PbSaveStreamQuery = pb.SaveStreamQuery;
export type PbCatchUpSubscribeToStreamRequest = pb.CatchUpSubscribeToStreamRequest;
export type PbCatchUpSubscribeToEventStoreRequest = pb.CatchUpSubscribeToEventStoreRequest;
export type PbGetEventsResponse = pb.GetEventsResponse;





/**
 * Logger interface for client logging
 */
export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}



export interface EventStoreClientOptions {
  /**
   * Server hostname or DNS name. Can be a comma-separated list of hosts for load balancing.
   * If using DNS-based load balancing, provide a single DNS name that resolves to multiple IPs.
   */
  host?: string;
  /**
   * Server port. Required when using a single host or comma-separated hosts.
   * Not required when using a target string.
   */
  port?: number;
  /**
   * Alternative to host:port. A fully qualified gRPC target string in the format:
   * dns:[//authority/]host[:port] or ipv4:host:port or ipv6:[host]:port
   * Examples: "dns:///eventstore.example.com:5005", "ipv4:10.0.0.10:5005"
   * When provided, this takes precedence over host and port.
   */
  target?: string;
  /**
   * gRPC credentials for secure connections
   */
  credentials?: grpc.ChannelCredentials;
  /**
   * Authentication username
   */
  username?: string;
  /**
   * Authentication password
   */
  password?: string;
  /**
   * Time in milliseconds between keep-alive pings
   */
  keepaliveTimeMs?: number;
  /**
   * Time in milliseconds to wait for ping response
   */
  keepaliveTimeoutMs?: number;
  /**
   * Allow keep-alive pings when there are no active calls
   */
  keepalivePermitWithoutCalls?: boolean;
  /**
   * Load balancing policy to use. Options: 'round_robin', 'pick_first'
   * - round_robin: Distributes requests across all available servers
   * - pick_first: Connects to the first available server
   */
  loadBalancingPolicy?: 'round_robin' | 'pick_first';

  /**
   * Custom logger implementation
   */
  logger?: Logger;
  /**
   * Enable or disable logging
   */
  enableLogging?: boolean;

}

/**
 * Validates client options and throws errors for invalid configurations
 */
function validateClientOptions(options: EventStoreClientOptions): void {
  // Validate connection options
  if (!options.target && !options.host) {
    throw new Error('Either host or target must be provided');
  }

  if (options.host && !options.target && !options.port) {
    throw new Error('Port must be provided when using host without target');
  }

  if (options.port && (options.port < 1 || options.port > 65535)) {
    throw new Error('Port must be between 1 and 65535');
  }

  // Validate keepalive options
  if (options.keepaliveTimeMs && options.keepaliveTimeMs < 0) {
    throw new Error('keepaliveTimeMs must be a positive number');
  }

  if (options.keepaliveTimeoutMs && options.keepaliveTimeoutMs < 0) {
    throw new Error('keepaliveTimeoutMs must be a positive number');
  }



  // Validate load balancing policy
  if (options.loadBalancingPolicy &&
    !['round_robin', 'pick_first'].includes(options.loadBalancingPolicy)) {
    throw new Error('loadBalancingPolicy must be either "round_robin" or "pick_first"');
  }
}

/**
 * Default no-op logger that doesn't log anything
 */
class NoopLogger implements Logger {
  debug(message: string, ...args: any[]): void { }
  info(message: string, ...args: any[]): void { }
  warn(message: string, ...args: any[]): void { }
  error(message: string, ...args: any[]): void { }
}

/**
 * orisun client operations
 */
export class EventStoreClient {
  private client: any;
  private channel!: grpc.Channel;
  private logger: Logger;
  private credentials?: grpc.Metadata;
  private disposed: boolean = false;

  constructor(options: EventStoreClientOptions = {}) {
    // Validate options
    validateClientOptions(options);

    const {
      host = 'localhost',
      port = 5005,
      target,
      credentials = grpc.credentials.createInsecure(),
      username = 'admin',
      password = 'changeit',
      keepaliveTimeMs = 30000, // 30 seconds by default
      keepaliveTimeoutMs = 10000, // 10 seconds by default
      keepalivePermitWithoutCalls = true, // Allow pings when there are no calls
      loadBalancingPolicy = 'round_robin',
      logger,
      enableLogging = false
    } = options;

    // Initialize logger
    this.logger = enableLogging ? (logger || console) : new NoopLogger();

    // Load the protobuf definition
    const PROTO_PATH = path.join(__dirname, '../eventstore.proto');
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const eventStoreProto = grpc.loadPackageDefinition(packageDefinition) as any;

    // Create the client with keep-alive options and load balancing
    const channelOptions = {
      // 'grpc.keepalive_time_ms': keepaliveTimeMs,
      // 'grpc.keepalive_timeout_ms': keepaliveTimeoutMs,
      // 'grpc.keepalive_permit_without_calls': keepalivePermitWithoutCalls ? 1 : 0,
      // 'grpc.http2.min_time_between_pings_ms': keepaliveTimeMs,
      // 'grpc.http2.max_pings_without_data': 0,
      'grpc.lb_policy_name': loadBalancingPolicy,
      'grpc.service_config': JSON.stringify({
        loadBalancingConfig: [{ [loadBalancingPolicy]: {} }]
      })
    };

    // Determine the target string
    let targetString: string;

    if (target) {
      // Use the provided target string directly
      targetString = target;
    } else if (host.includes(',')) {
      // Handle comma-separated list of hosts for manual load balancing
      const hosts = host.split(',').map(h => h.trim());
      targetString = hosts.map(h => `${h}:${port}`).join(',');
    } else {
      // Standard host:port format
      targetString = `${host}:${port}`;
    }

    this.client = new eventStoreProto.eventstore.EventStore(
      targetString,
      credentials,
      channelOptions
    );

    // Set up authentication metadata
    this.credentials = new grpc.Metadata();
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    this.credentials.add('authorization', `Basic ${auth}`);

    // Set up logger
    this.logger = options.logger || {
      debug: () => { },
      info: () => { },
      warn: () => { },
      error: () => { }
    };

    if (options.enableLogging) {
      this.logger.info('EventStoreClient initialized');
    }

    // Perform mandatory health check immediately after connection
    // Use setImmediate to perform health check after constructor completes
    setImmediate(async () => {
      // Skip health check if client has been disposed
      if (this.disposed) {
        return;
      }
      
      try {
        const isHealthy = await this.healthCheck();
        if (!isHealthy) {
          const error = new Error('EventStore connection health check failed');
          this.logger.error('Initial health check failed:', error);
          throw error;
        }
        this.logger.info('Initial health check passed - connection established');
      } catch (error) {
        this.logger.error('Initial health check error:', error);
        throw error;
      }
    });
  }

  /**
   * Save events to a stream
   * @throws {Error} If the request is invalid or the operation fails
   * @returns {Promise<WriteResult>} The write result containing the log position
   */
  async saveEvents(request: SaveEventsRequest): Promise<WriteResult>;
  async saveEvents(
    streamName: string,
    events: Event[],
    expectedVersion?: number
  ): Promise<WriteResult>;
  async saveEvents(
    requestOrStreamName: SaveEventsRequest | string,
    events?: Event[],
    expectedVersion?: number
  ): Promise<WriteResult> {
    // Handle overloaded method signatures
    let request: SaveEventsRequest;
    if (typeof requestOrStreamName === 'string') {
      if (!events || !Array.isArray(events)) {
        throw new Error('Events array is required when using streamName parameter');
      }
      request = {
        boundary: 'default',
        stream: {
          name: requestOrStreamName,
          expectedVersion: expectedVersion ?? -1
        },
        events: events.map(event => ({
          eventId: event.eventId,
          eventType: event.eventType,
          data: event.data,
          metadata: event.metadata
        }))
      };
    } else {
      request = requestOrStreamName;
    }
    // Check if client is disposed
    if (this.disposed) {
      throw new Error('Client has been disposed');
    }

    if (!request) {
      throw new Error('SaveEventsRequest cannot be null or undefined');
    }

    if (!request.boundary) {
      throw new Error('Boundary is required');
    }

    if (!request.stream || !request.stream.name) {
      throw new Error('Stream name is required');
    }

    if (!request.events || !Array.isArray(request.events) || request.events.length === 0) {
      throw new Error('At least one event is required');
    }

    // Validate each event
    request.events.forEach((event, index) => {
      if (!event.eventId) {
        throw new Error(`Event at index ${index} is missing eventId`);
      }
      if (!event.eventType) {
        throw new Error(`Event at index ${index} is missing eventType`);
      }
      if (event.data === undefined || event.data === null) {
        throw new Error(`Event at index ${index} is missing data`);
      }
    });

    this.logger.debug(`Saving ${request.events.length} events to stream '${request.stream.name}'`);

    const saveEventsAsync = promisify(this.client.saveEvents.bind(this.client));

    // Try using plain object approach instead of generated protobuf classes
    const grpcRequest = {
      boundary: request.boundary,
      stream: {
        name: request.stream.name,
        expected_version: request.stream.expectedVersion,
        ...(request.stream.subsetQuery && { subsetquery: request.stream.subsetQuery })
      },
      events: request.events.map(event => ({
        event_id: event.eventId,
        event_type: event.eventType,
        data: JSON.stringify(event.data),
        metadata: JSON.stringify(event.metadata || {})
      }))
    };

    try {
      const response = await saveEventsAsync(grpcRequest, this.credentials || new grpc.Metadata());

      this.logger.info(`Successfully saved events to stream '${request.stream.name}'`);

      // Transform the gRPC response to match our interface
      return {
        logPosition: {
          commitPosition: Number(response.log_position?.commit_position || '0'),
          preparePosition: Number(response.log_position?.prepare_position || '0')
        },
        newStreamVersion: Number(response.new_stream_version || '0')
      };
    } catch (error) {
      this.logger.error(`Failed to save events to stream '${request.stream.name}':`, error);

      // Enhance error with context
      const enhancedError = new Error(
        `Failed to save events to stream '${request.stream.name}': ${(error as Error).message}`
      );
      enhancedError.stack = (error as Error).stack;
      (enhancedError as any).originalError = error;
      (enhancedError as any).streamName = request.stream.name;
      (enhancedError as any).eventCount = request.events.length;

      throw enhancedError;
    }
  }

  /**
   * Get events from a stream
   * @throws {Error} If the request is invalid or the operation fails
   */
  async getEvents(request: GetEventsRequest): Promise<Event[]> {
    // Check if client is disposed
    if (this.disposed) {
      throw new Error('Client has been disposed');
    }

    if (!request) {
      throw new Error('GetEventsRequest cannot be null or undefined');
    }

    if (!request.boundary) {
      throw new Error('Boundary is required');
    }

    // If stream is specified, validate stream name
    if (request.stream && !request.stream.name) {
      throw new Error('Stream name is required when stream is specified');
    }

    // Validate count if provided
    if (request.count !== undefined && request.count <= 0) {
      throw new Error('Count must be greater than 0');
    }

    const streamInfo = request.stream ? `stream '${request.stream.name}'` : 'all streams';
    this.logger.debug(`Getting events from ${streamInfo}`);

    const getEventsAsync = promisify(this.client.getEvents.bind(this.client));

    const countValue = request.count || 100;
    this.logger.debug(`Setting count to: ${countValue}`);
    
    // Use plain object instead of protobuf classes
    const grpcRequest: any = {
      boundary: request.boundary,
      count: countValue,
      direction: request.direction === 'DESC' ? 1 : 0 // DESC = 1, ASC = 0
    };

    if (request.query) {
      grpcRequest.query = request.query;
    }

    if (request.fromPosition) {
      grpcRequest.fromPosition = {
        commitPosition: request.fromPosition.commitPosition,
        preparePosition: request.fromPosition.preparePosition
      };
    }

    if (request.stream) {
      grpcRequest.stream = {
        name: request.stream.name,
        fromVersion: request.stream.fromVersion || 0
      };
    }
    
    this.logger.debug(`Getting events from ${streamInfo} with count: ${countValue}`);

    try {
      const response = await getEventsAsync(grpcRequest, this.credentials || new grpc.Metadata());
      


      if (!response || !response.events || response.events.length === 0) {
        this.logger.warn(`No events returned from ${streamInfo}`);
        return [];
      }

      const events = response.events.map((event: any) => {
        try {
          return {
            eventId: event.event_id,
            eventType: event.event_type,
            data: JSON.parse(event.data),
            metadata: JSON.parse(event.metadata || '{}'),
            streamId: event.stream_id,
            version: Number(event.version || '0'),
            position: {
              commitPosition: Number(event.position?.commit_position || '0'),
              preparePosition: Number(event.position?.prepare_position || '0')
            },
            dateCreated: event.date_created ? new Date(Number(event.date_created.seconds) * 1000 + Math.floor(event.date_created.nanos / 1000000)).toISOString() : new Date().toISOString()
          };
        } catch (parseError) {
          this.logger.error(`Failed to parse event data or metadata: ${(parseError as Error).message}`);
          // Return event with unparsed data to avoid losing the event
          return {
            eventId: event.event_id,
            eventType: event.event_type,
            data: event.data, // Raw string
            metadata: event.metadata || '{}', // Raw string
            streamId: event.stream_id,
            version: Number(event.version || '0'),
            position: {
              commitPosition: Number(event.position?.commit_position || '0'),
              preparePosition: Number(event.position?.prepare_position || '0')
            },
            dateCreated: event.date_created ? new Date(Number(event.date_created.seconds) * 1000 + Math.floor(event.date_created.nanos / 1000000)).toISOString() : new Date().toISOString()
          };
        }
      });

      this.logger.debug(`Successfully retrieved ${events.length} events from ${streamInfo}`);
      return events;
    } catch (error) {
      this.logger.error(`Failed to get events from ${streamInfo}:`, error);

      // Enhance error with context
      const enhancedError = new Error(
        `Failed to get events from ${streamInfo}: ${(error as Error).message}`
      );
      enhancedError.stack = (error as Error).stack;
      (enhancedError as any).originalError = error;
      (enhancedError as any).streamName = request.stream?.name;
      (enhancedError as any).boundary = request.boundary;

      throw enhancedError;
    }
  }

  /**
   * Subscribe to events from a stream or all streams
   * @throws {Error} If the request is invalid
   */
  subscribeToEvents(request: SubscribeRequest, onEvent: (event: Event) => void, onError?: (error: Error) => void): grpc.ClientReadableStream<any> {
    // Check if client is disposed
    if (this.disposed) {
      throw new Error('Client has been disposed');
    }

    if (!request) {
      throw new Error('SubscribeRequest cannot be null or undefined');
    }

    if (!request.boundary) {
      throw new Error('Boundary is required');
    }

    if (!request.subscriberName) {
      throw new Error('Subscriber name is required');
    }

    if (!onEvent || typeof onEvent !== 'function') {
      throw new Error('Event handler function is required');
    }

    const streamInfo = request.stream ? `stream '${request.stream}'` : 'all streams';
    this.logger.debug(`Subscribing to ${streamInfo} with subscriber '${request.subscriberName}'`);

    let stream: grpc.ClientReadableStream<any>;

    try {
      if (request.stream) {
        // Subscribe to a specific stream - use plain object
        const grpcRequest: any = {
          subscriber_name: request.subscriberName,
          boundary: request.boundary,
          stream: request.stream,
          afterVersion: request.afterVersion || 0
        };

        if (request.query) {
          grpcRequest.query = request.query;
        }

        stream = this.client.catchUpSubscribeToStream(grpcRequest, this.credentials || new grpc.Metadata());
      } else {
        // Subscribe to all events - use plain object
        const grpcRequest: any = {
          subscriber_name: request.subscriberName,
          boundary: request.boundary,
        };

        if (request.afterPosition) {
          grpcRequest.afterPosition = {
            commit_position: request.afterPosition.commitPosition,
            prepare_position: request.afterPosition.preparePosition
          };
        }

        if (request.query) {
          grpcRequest.query = request.query;
        }

        stream = this.client.catchUpSubscribeToEvents(grpcRequest, this.credentials || new grpc.Metadata());
      }
    } catch (error) {
      // Circuit breaker functionality has been removed

      this.logger.error(`Failed to create subscription to ${streamInfo}:`, error);

      // Enhance error with context
      const enhancedError = new Error(
        `Failed to create subscription to ${streamInfo}: ${(error as Error).message}`
      );
      enhancedError.stack = (error as Error).stack;
      (enhancedError as any).originalError = error;
      (enhancedError as any).streamName = request.stream;
      (enhancedError as any).subscriberName = request.subscriberName;

      throw enhancedError;
    }

    this.logger.debug(`Successfully subscribed to ${streamInfo}`);

    // Handle data events
    stream.on('data', (event: any) => {
      try {
        const parsedEvent: Event = {
          eventId: event.event_id,
          eventType: event.event_type,
          data: JSON.parse(event.data),
          metadata: JSON.parse(event.metadata || '{}'),
          streamId: event.stream_id,
          version: Number(event.version || '0'),
            position: {
              commitPosition: Number(event.position?.commit_position || '0'),
              preparePosition: Number(event.position?.prepare_position || '0')
            },
            dateCreated: event.date_created ? new Date(Number(event.date_created.seconds) * 1000 + Math.floor(event.date_created.nanos / 1000000)).toISOString() : new Date().toISOString()
        };
        onEvent(parsedEvent);
      } catch (parseError) {
        this.logger.error(`Failed to parse event data or metadata: ${(parseError as Error).message}`);

        // Call error handler with enhanced error
        const enhancedError = new Error(
          `Failed to parse event: ${(parseError as Error).message}`
        );
        enhancedError.stack = (parseError as Error).stack;
        (enhancedError as any).originalError = parseError;
        (enhancedError as any).eventId = event.eventId;
        (enhancedError as any).eventType = event.eventType;

        if (onError) {
          onError(enhancedError);
        } else {
          this.logger.error('Subscription parse error:', enhancedError);
        }
      }
    });

    // Handle stream errors
    stream.on('error', (error: Error) => {
      this.logger.error(`Subscription error for ${streamInfo}:`, error);

      // Enhance error with context
      const enhancedError = new Error(
        `Subscription error for ${streamInfo}: ${error.message}`
      );
      enhancedError.stack = error.stack;
      (enhancedError as any).originalError = error;
      (enhancedError as any).streamName = request.stream;
      (enhancedError as any).subscriberName = request.subscriberName;

      if (onError) {
        onError(enhancedError);
      } else {
        this.logger.error('Unhandled subscription error:', enhancedError);
      }
    });

    // Handle end of stream
    stream.on('end', () => {
      this.logger.debug(`Subscription to ${streamInfo} ended`);
    });

    return stream;
  }

  /**
   * Close the client connection and clean up resources
   */
  close(): void {
    if (this.disposed) {
      this.logger.debug('EventStoreClient already disposed');
      return;
    }

    this.logger.debug('Closing EventStoreClient connection');

    try {
      // No rate limiter or circuit breaker to clean up

      // In newer versions of gRPC, we need to close the channel
      if (this.client && typeof this.client.close === 'function') {
        this.client.close();
      } else if (this.client && (this.client as any).channel) {
        // Try to close the underlying channel
        const channel = (this.client as any).channel;
        if (typeof channel.close === 'function') {
          channel.close();
        }
      }

      this.disposed = true;
      this.logger.debug('EventStoreClient connection closed successfully');
    } catch (error) {
      this.logger.error('Error closing EventStoreClient connection:', error);
      throw new Error(`Failed to close EventStoreClient: ${(error as Error).message}`);
    }
  }

  /**
   * Check if the client is connected to the server
   * @returns Promise<boolean> True if connected, false otherwise
   */
  async healthCheck(): Promise<boolean> {
    // Check if client is disposed
    if (this.disposed) {
      throw new Error('Client has been disposed');
    }

    this.logger.debug('Performing health check');

    try {
      // Try to make a simple call to test connectivity
      await this.getEvents({
        boundary: 'orisun_admin',
        stream: { name: 'health-check' }
      });

      this.logger.debug('Health check successful');
      return true;
    } catch (error) {
      this.logger.warn('Health check failed:', error);
      return false;
    }
  }
}