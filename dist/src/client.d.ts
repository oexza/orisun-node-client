import * as grpc from '@grpc/grpc-js';
import * as pb from './generated/eventstore_pb';
export interface Event {
    eventId: string;
    eventType: string;
    data: any;
    metadata?: Record<string, string>;
    streamId: string;
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
        expectedPosition: Position;
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
    };
}
export interface SubscribeRequest {
    afterPosition?: Position;
    query?: Query;
    subscriberName: string;
    boundary: string;
    stream?: string;
}
export interface WriteResult {
    logPosition: Position;
}
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
 * orisun client operations
 */
export declare class EventStoreClient {
    private client;
    private channel;
    private logger;
    private credentials?;
    private disposed;
    private cachedToken?;
    constructor(options?: EventStoreClientOptions);
    /**
     * Create metadata with authentication token or basic auth
     * @param operation Optional description of the operation for logging
     * @returns gRPC Metadata with authentication headers
     */
    private createAuthMetadata;
    /**
     * Set up metadata event listener to cache authentication tokens from response
     * @param call The gRPC call object
     * @param operation Optional description of the operation for logging
     */
    private setupTokenCaching;
    /**
     * Save events to a stream
     * @throws {Error} If the request is invalid or the operation fails
     * @returns {Promise<WriteResult>} The write result containing the log position
     */
    saveEvents(request: SaveEventsRequest): Promise<WriteResult>;
    /**
     * Get events from a stream
     * @throws {Error} If the request is invalid or the operation fails
     */
    getEvents(request: GetEventsRequest): Promise<Event[]>;
    /**
     * Subscribe to events using async iteration (for await...of)
     * @param request The subscription request
     * @param onEvent Event handler function
     * @param onError Optional error handler function
     * @returns gRPC stream that can be cancelled
     */
    subscribeToEvents(request: SubscribeRequest, onEvent: (event: Event) => Promise<void>, onError?: (error: Error) => void): grpc.ClientReadableStream<any>;
    /**
     * Close the client connection and clean up resources
     */
    close(): void;
    /**
     * Ping the server to check connectivity
     * @returns Promise<void> Resolves if the server responds successfully
     */
    ping(): Promise<void>;
    /**
     * Check if the client is connected to the server
     * @returns Promise<boolean> True if connected, false otherwise
     */
    healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=client.d.ts.map